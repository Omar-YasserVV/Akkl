// warehouse.repository.ts
import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { BatchStatus, stockStatus } from 'libs/db/generated/client/enums';
import { CreateInventoryItemReqDto } from './dto/inventory/inventory.create.dto';
import { ListInventoryItemsReqDto } from './dto/inventory/inventory.list.dto';
import {
  ConsumeInventoryItemReqDto,
  RestockInventoryItemReqDto,
  UpdateInventoryItemReqDto,
} from './dto/inventory/inventory.update.dto';

/**
 * Handles all data access and persistence logic for warehouse operations,
 * using Prisma ORM to interact with the database.
 */
@Injectable()
export class WarehouseRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── Lookups ────────────────────────────────────────────────────────────────

  /**
   * Retrieves a warehouse by its ID.
   * @param warehouseId The ID of the warehouse.
   * @returns The warehouse entity or null if not found.
   */
  async getWarehouse(warehouseId: string) {
    return this.prisma.warehouse.findUnique({ where: { id: warehouseId } });
  }

  /**
   * Retrieves an ingredient by its ID.
   * @param ingredientId The ID of the ingredient.
   * @returns The ingredient entity or null if not found.
   */
  async getIngredient(ingredientId: string) {
    return this.prisma.ingredient.findUnique({ where: { id: ingredientId } });
  }

  /**
   * Retrieves a single inventory item by its ID, including its ingredient and all related stock batches,
   * ordered FEFO (First-Expire, First-Out): batches are sorted by their expiry date, then received date.
   * Batches without an expiry date appear last.
   * @param inventoryItemId The inventory item ID.
   * @returns The inventory item with associated ingredient and ordered batches, or null if not found.
   */
  async getInventoryItem(inventoryItemId: string) {
    return this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: {
        ingredient: true,
        batches: {
          orderBy: [
            // Batches with no expiry go last (treat as never-expiring)
            { expiresAt: 'asc' },
            { receivedAt: 'asc' },
          ],
        },
      },
    });
  }

  /**
   * Lists inventory items belonging to a warehouse, with support for an optional stock status filter
   * and pagination.
   * @param dto Query parameters including warehouseId, optional stockStatus, page, and limit.
   * @returns An object containing items (array), total (item count), current page, and page size (limit).
   */
  async getAllInventoryItems(dto: ListInventoryItemsReqDto) {
    const { warehouseId, stockStatus: status, page = 1, limit = 10 } = dto;

    const where = {
      warehouseId,
      ...(status && { stockStatus: status }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.inventoryItem.findMany({
        where,
        include: {
          ingredient: true,
          batches: {
            orderBy: [{ expiresAt: 'asc' }, { receivedAt: 'asc' }],
          },
        },
        skip: (page - 1) * limit,
        take: Number(limit),
      }),
      this.prisma.inventoryItem.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  // ── CRUD ───────────────────────────────────────────────────────────────────

  /**
   * Deletes an inventory item by its ID.
   * @param id The inventory item ID.
   */
  async deleteInventoryItem(id: string) {
    await this.prisma.inventoryItem.delete({ where: { id } });
  }

  /**
   * Creates a new inventory item (slot for an ingredient at a warehouse).
   * The initial quantity is set to zero; inventory is added through restocking operations.
   * @param data Inventory item creation payload.
   * @returns The created inventory item including its ingredient and batch relations.
   */
  async createInventoryItem(data: CreateInventoryItemReqDto) {
    return this.prisma.inventoryItem.create({
      data: {
        quantity: 0,
        minimumQuantity: data.minimumQuantity,
        warehouseId: data.warehouseId,
        ingredientId: data.ingredientId,
        stockStatus: stockStatus.OUT_OF_STOCK,
      },
      include: {
        ingredient: true,
        batches: true,
      },
    });
  }

  // ── Restock ────────────────────────────────────────────────────────────────

  /**
   * Adds new stock to an inventory item.
   * - Creates a new StockBatch to represent a specific delivery.
   * - Updates the item's total quantity and computes new stock status.
   * @param dto Restock operation request containing inventory item ID and batch details.
   * @returns The updated inventory item, including relations.
   * @throws Error if the inventory item does not exist.
   */
  async restockInventoryItem(dto: RestockInventoryItemReqDto) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.id },
    });
    if (!item) throw new Error('Inventory item not found');

    const newQuantity = item.quantity + dto.addedQuantity;

    const [, updated] = await this.prisma.$transaction([
      // 1. Create the new batch for this delivery
      this.prisma.stockBatch.create({
        data: {
          inventoryItemId: dto.id,
          initialQuantity: dto.addedQuantity,
          remainingQuantity: dto.addedQuantity,
          numberOfUnits: dto.numberOfUnits ?? null,
          unitSize: dto.unitSize ?? null,
          expiresAt: dto.expiresAt ?? null,
          status: BatchStatus.ACTIVE,
        },
      }),
      // 2. Sync the item's total quantity and stock status
      this.prisma.inventoryItem.update({
        where: { id: dto.id },
        data: {
          quantity: newQuantity,
          stockStatus: this.resolveStockStatus(
            newQuantity,
            item.minimumQuantity,
          ),
        },
        include: {
          ingredient: true,
          batches: {
            orderBy: [{ expiresAt: 'asc' }, { receivedAt: 'asc' }],
          },
        },
      }),
    ]);

    return updated;
  }

  // ── Consume (FEFO) ─────────────────────────────────────────────────────────

  /**
   * Consumes (reduces) stock from an inventory item using the FEFO (First-Expire, First-Out) strategy.
   * - Deducts consumed quantity from active stock batches, starting with the batch that expires soonest.
   * - Updates each batch's remaining quantity and marks depleted batches accordingly.
   * - Recomputes and syncs item's total quantity and stock status.
   * - All operations happen in a single transaction.
   * @param dto Consume operation request including item ID and amount to consume.
   * @returns The updated inventory item (fully hydrated) including ingredient and batches.
   * @throws Error if the inventory item does not exist, or if stock is insufficient.
   */
  async consumeInventoryItem(dto: ConsumeInventoryItemReqDto) {
    // Get the inventory item including all related ingredient and batches
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.id },
      include: {
        ingredient: true,
        batches: {
          // All batches are loaded for full update visibility and accurate state after transaction
          orderBy: [{ expiresAt: 'asc' }, { receivedAt: 'asc' }],
        },
      },
    });

    if (!item) throw new Error('Inventory item not found');

    // Only ACTIVE batches are considered for stock deduction (FEFO)
    const activeBatches = item.batches.filter(
      (b) => b.status === BatchStatus.ACTIVE,
    );

    // Guard: Verify that enough stock is available for the request
    const totalAvailable = activeBatches.reduce(
      (sum, b) => sum + b.remainingQuantity,
      0,
    );
    if (totalAvailable < dto.consumedQuantity) {
      throw new Error(
        `Insufficient stock: need ${dto.consumedQuantity}, have ${totalAvailable}`,
      );
    }

    // Prepare batch update operations (deduct from FEFO batches until satisfied)
    let remaining = dto.consumedQuantity;
    const batchUpdates: ReturnType<typeof this.prisma.stockBatch.update>[] = [];

    for (const batch of activeBatches) {
      if (remaining <= 0) break;
      const deductFromBatch = Math.min(batch.remainingQuantity, remaining);
      const newBatchRemaining = batch.remainingQuantity - deductFromBatch;
      remaining -= deductFromBatch;
      batchUpdates.push(
        this.prisma.stockBatch.update({
          where: { id: batch.id },
          data: {
            remainingQuantity: newBatchRemaining,
            status:
              newBatchRemaining === 0
                ? BatchStatus.DEPLETED
                : BatchStatus.ACTIVE,
          },
        }),
      );
    }

    const newItemQuantity = item.quantity - dto.consumedQuantity;

    // Execute all updates as a transaction
    await this.prisma.$transaction([
      ...batchUpdates,
      this.prisma.inventoryItem.update({
        where: { id: dto.id },
        data: {
          quantity: newItemQuantity,
          stockStatus: this.resolveStockStatus(
            newItemQuantity,
            item.minimumQuantity,
          ),
        },
      }),
    ]);

    // Fetch and return the updated item with all relations after consumption
    const updated = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.id },
      include: {
        ingredient: true,
        batches: {
          orderBy: [{ expiresAt: 'asc' }, { receivedAt: 'asc' }],
        },
      },
    });

    if (!updated) throw new Error('Inventory item not found after update');
    return updated;
  }

  // ── Update ─────────────────────────────────────────────────────────────────

  /**
   * Updates inventory item metadata (such as minimumQuantity and/or ingredientId).
   * Does not change quantity: stock is only adjusted through consume/restock.
   * If minimumQuantity is changed, stock status is re-evaluated using the current quantity.
   * @param dto Update request data (may include minimumQuantity and/or ingredientId).
   * @returns The updated inventory item, including ingredient and batches.
   * @throws Error if the inventory item does not exist.
   */
  async updateInventoryItem(dto: UpdateInventoryItemReqDto) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.id },
    });
    if (!item) throw new Error('Inventory item not found');

    // If minimumQuantity is being updated, stock status must be re-evaluated
    const newMinimum = dto.minimumQuantity ?? item.minimumQuantity;

    return this.prisma.inventoryItem.update({
      where: { id: dto.id },
      data: {
        ...(dto.minimumQuantity !== undefined && {
          minimumQuantity: dto.minimumQuantity,
          stockStatus: this.resolveStockStatus(item.quantity, newMinimum),
        }),
        ...(dto.ingredientId !== undefined && {
          ingredientId: dto.ingredientId,
        }),
      },
      include: {
        ingredient: true,
        batches: {
          orderBy: [{ expiresAt: 'asc' }, { receivedAt: 'asc' }],
        },
      },
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Computes the appropriate stockStatus for an item,
   * based on its current quantity and minimum required quantity.
   * @param quantity The current quantity of the item.
   * @param minimumQuantity The minimum quantity before low/out-of-stock status applies.
   * @returns The computed stockStatus (OUT_OF_STOCK, LOW_STOCK, or IN_STOCK).
   */
  private resolveStockStatus(
    quantity: number,
    minimumQuantity: number,
  ): stockStatus {
    if (quantity <= 0) return stockStatus.OUT_OF_STOCK;
    if (quantity <= minimumQuantity) return stockStatus.LOW_STOCK;
    return stockStatus.IN_STOCK;
  }
}
