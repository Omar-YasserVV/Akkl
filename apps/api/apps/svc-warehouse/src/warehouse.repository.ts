// warehouse.repository.ts
import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'libs/db/generated/client/client';
import {
  BatchStatus,
  InventoryLogAction,
  stockStatus,
} from 'libs/db/generated/client/enums';
import {
  IngredientDto
} from './dto/inventory/Inventory.base.dto';
import { CreateInventoryItemReqDto } from './dto/inventory/inventory.create.dto';
import { ListInventoryItemsReqDto } from './dto/inventory/inventory.list.dto';
import {
  ConsumeInventoryItemReqDto,
  RestockInventoryItemReqDto,
  UpdateInventoryItemReqDto,
} from './dto/inventory/inventory.update.dto';

@Injectable()
export class WarehouseRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── Lookups ────────────────────────────────────────────────────────────────

  async getWarehouse(warehouseId: string) {
    return this.prisma.warehouse.findUnique({ where: { id: warehouseId } });
  }

  async getIngredient(ingredientId: string) {
    return this.prisma.ingredient.findUnique({ where: { id: ingredientId } });
  }

  async findIngredientByName(name: string) {
    return this.prisma.ingredient.findUnique({ where: { name } });
  }

  async createIngredient(dto: IngredientDto) {
    return this.prisma.ingredient.create({ data: dto });
  }
  async getIngredients() {
    return this.prisma.ingredient.findMany();
  }

  async getInventoryItem(inventoryItemId: string) {
    return this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: {
        ingredient: true,
        batches: {
          orderBy: [{ expiresAt: 'asc' }, { receivedAt: 'asc' }],
        },
      },
    });
  }

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

  async deleteInventoryItem(id: string) {
    await this.prisma.inventoryItem.delete({ where: { id } });
  }

  async createInventoryItem(data: CreateInventoryItemReqDto) {
    // Used an interactive transaction to get the ID of the newly created item for the log
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.create({
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

      await tx.inventoryUsageLog.create({
        data: {
          inventoryItemId: item.id,
          action: InventoryLogAction.CREATE,
          quantityChange: 0,
          previousQuantity: 0,
          newQuantity: 0,
          notes: 'Initial creation',
        },
      });

      return item;
    });
  }

  // ── Restock ────────────────────────────────────────────────────────────────

  async restockInventoryItem(dto: RestockInventoryItemReqDto) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.id },
    });
    if (!item) throw new Error('Inventory item not found');

    const newQuantity = item.quantity + dto.addedQuantity;

    const [, updated] = await this.prisma.$transaction([
      // 1. Create the new batch
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
      // 2. Sync the item's total quantity
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
      // 3. Log the restock action
      this.prisma.inventoryUsageLog.create({
        data: {
          inventoryItemId: item.id,
          action: InventoryLogAction.RESTOCK,
          quantityChange: dto.addedQuantity,
          previousQuantity: item.quantity,
          newQuantity: newQuantity,
        },
      }),
    ]);

    return updated;
  }

  // ── Consume (FEFO) ─────────────────────────────────────────────────────────

  async consumeInventoryItem(dto: ConsumeInventoryItemReqDto) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.id },
      include: {
        ingredient: true,
        batches: {
          orderBy: [{ expiresAt: 'asc' }, { receivedAt: 'asc' }],
        },
      },
    });

    if (!item) throw new Error('Inventory item not found');

    const activeBatches = item.batches.filter(
      (b) => b.status === BatchStatus.ACTIVE,
    );
    const totalAvailable = activeBatches.reduce(
      (sum, b) => sum + b.remainingQuantity,
      0,
    );

    if (totalAvailable < dto.consumedQuantity) {
      throw new Error(
        `Insufficient stock: need ${dto.consumedQuantity}, have ${totalAvailable}`,
      );
    }

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

    await this.prisma.$transaction([
      ...batchUpdates,
      // Update main item
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
      // Log consumption
      this.prisma.inventoryUsageLog.create({
        data: {
          inventoryItemId: item.id,
          action: InventoryLogAction.CONSUME,
          quantityChange: -dto.consumedQuantity,
          previousQuantity: item.quantity,
          newQuantity: newItemQuantity,
        },
      }),
    ]);

    const updated = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.id },
      include: {
        ingredient: true,
        batches: { orderBy: [{ expiresAt: 'asc' }, { receivedAt: 'asc' }] },
      },
    });

    if (!updated) throw new Error('Inventory item not found after update');
    return updated;
  }

  // ── Update ─────────────────────────────────────────────────────────────────

  async updateInventoryItem(dto: UpdateInventoryItemReqDto) {
    // Interactive transaction used so we can get the previous state, update it, and log it atomically.
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({
        where: { id: dto.id },
      });
      if (!item) throw new Error('Inventory item not found');

      const newMinimum = dto.minimumQuantity ?? item.minimumQuantity;

      const updatedItem = await tx.inventoryItem.update({
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

      // Log metadata update
      await tx.inventoryUsageLog.create({
        data: {
          inventoryItemId: item.id,
          action: InventoryLogAction.UPDATE,
          quantityChange: 0,
          previousQuantity: item.quantity,
          newQuantity: item.quantity, // Quantity didn't change
          notes: `Updated metadata. Min Qty: ${newMinimum}`,
        },
      });

      return updatedItem;
    });
  }

  // ── Transactions ───────────────────────────────────────────────────────────

  async consumeInventoryItemWithTx(
    tx: Prisma.TransactionClient,
    inventoryItemId: string,
    consumedQuantity: number,
  ) {
    const item = await tx.inventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: {
        batches: {
          where: { status: BatchStatus.ACTIVE },
          orderBy: [{ expiresAt: 'asc' }, { receivedAt: 'asc' }],
        },
      },
    });

    if (!item) throw new Error(`InventoryItem ${inventoryItemId} not found`);

    const totalAvailable = item.batches.reduce(
      (sum, b) => sum + b.remainingQuantity,
      0,
    );
    if (totalAvailable < consumedQuantity) {
      throw new Error(
        `Insufficient stock for item ${inventoryItemId}: need ${consumedQuantity}, have ${totalAvailable}`,
      );
    }

    let remaining = consumedQuantity;
    for (const batch of item.batches) {
      if (remaining <= 0) break;
      const deduct = Math.min(batch.remainingQuantity, remaining);
      const newRemaining = batch.remainingQuantity - deduct;
      remaining -= deduct;

      await tx.stockBatch.update({
        where: { id: batch.id },
        data: {
          remainingQuantity: newRemaining,
          status:
            newRemaining === 0 ? BatchStatus.DEPLETED : BatchStatus.ACTIVE,
        },
      });
    }

    const newQuantity = item.quantity - consumedQuantity;

    // Update main item inside the external transaction
    await tx.inventoryItem.update({
      where: { id: item.id },
      data: {
        quantity: newQuantity,
        stockStatus: this.resolveStockStatus(newQuantity, item.minimumQuantity),
      },
    });

    // Add log creation inside the external transaction
    await tx.inventoryUsageLog.create({
      data: {
        inventoryItemId: item.id,
        action: InventoryLogAction.CONSUME,
        quantityChange: -consumedQuantity,
        previousQuantity: item.quantity,
        newQuantity: newQuantity,
        notes: 'Consumed via batch transaction',
      },
    });
  }

  // ── Lookups (Misc) ─────────────────────────────────────────────────────────

  getWarehouseByBranch(branchId: string) {
    return this.prisma.warehouse.findUnique({ where: { branchId } });
  }

  getRecipesForMenuItems(menuItemIds: string[]) {
    return this.prisma.recipe.findMany({
      where: { menuItemId: { in: menuItemIds } },
    });
  }

  getInventoryItemsByIngredients(warehouseId: string, ingredientIds: string[]) {
    return this.prisma.inventoryItem.findMany({
      where: {
        warehouseId,
        ingredientId: { in: ingredientIds },
      },
    });
  }

  async deductBatch(
    consumptionMap: Map<string, number>,
    inventoryMap: Map<string, { id: string }>,
  ) {
    await this.prisma.$transaction(async (tx) => {
      for (const [ingredientId, totalConsumed] of consumptionMap) {
        const invItem = inventoryMap.get(ingredientId);
        if (!invItem) {
          throw new Error(`No inventory item for ingredient ${ingredientId}`);
        }
        await this.consumeInventoryItemWithTx(tx, invItem.id, totalConsumed);
      }
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private resolveStockStatus(
    quantity: number,
    minimumQuantity: number,
  ): stockStatus {
    if (quantity <= 0) return stockStatus.OUT_OF_STOCK;
    if (quantity <= minimumQuantity) return stockStatus.LOW_STOCK;
    return stockStatus.IN_STOCK;
  }
}
