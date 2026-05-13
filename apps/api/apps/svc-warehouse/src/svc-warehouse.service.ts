// svc-warehouse.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { createPagination } from 'utils/pagination.util';
import { IngredientDto } from './dto/inventory/Inventory.base.dto';
import {
  CreateInventoryItemReqDto,
  CreateInventoryItemResDto,
} from './dto/inventory/inventory.create.dto';
import {
  DeductForOrderReqDto,
  DeductForOrderResDto,
} from './dto/inventory/inventory.deduct.dto';
import {
  DeleteInventoryItemReqDto,
  DeleteInventoryItemResDto,
} from './dto/inventory/inventory.delete.dto';
import {
  GetInventoryItemReqDto,
  GetInventoryItemResDto,
} from './dto/inventory/inventory.get.dto';
import {
  ListInventoryItemsReqDto,
  ListInventoryItemsResDto,
} from './dto/inventory/inventory.list.dto';
import {
  ConsumeInventoryItemReqDto,
  ConsumeInventoryItemResDto,
  RestockInventoryItemReqDto,
  RestockInventoryItemResDto,
  UpdateInventoryItemReqDto,
  UpdateInventoryItemResDto,
} from './dto/inventory/inventory.update.dto';
import { toInventoryResDto } from './mappers/inventory.mapper';
import { WarehouseRepository } from './warehouse.repository';

@Injectable()
export class SvcWarehouseService {
  private readonly logger = new Logger(SvcWarehouseService.name);

  constructor(private readonly repo: WarehouseRepository) {}

  /**
   * Retrieve a single inventory item by ID.
   * This includes associated ingredient data and all related stock batches (active and inactive).
   *
   * @param dto - Payload containing the inventory item ID to retrieve.
   * @returns The inventory item, with ingredient and batches, mapped to GetInventoryItemResDto.
   * @throws RpcException (404) - If the inventory item with the given ID is not found.
   */
  async getInventoryItem(
    dto: GetInventoryItemReqDto,
  ): Promise<GetInventoryItemResDto> {
    const item = await this.repo.getInventoryItem(dto.id);
    if (!item)
      throw new RpcException({
        message: 'Inventory item not found',
        status: 404,
      });
    return toInventoryResDto(item);
  }

  /**
   * Get a paginated list of inventory items for a specific warehouse, optionally filtered by stock status.
   *
   * @param dto - Contains pagination params, warehouse ID, and optional stock status filter.
   * @returns Paginated response of inventory items in ListInventoryItemsResDto format.
   */
  async listInventoryItems(
    dto: ListInventoryItemsReqDto,
  ): Promise<ListInventoryItemsResDto> {
    const { items, total, page, limit } =
      await this.repo.getAllInventoryItems(dto);
    return createPagination(items.map(toInventoryResDto), total, page, limit);
  }

  /**
   * Delete an inventory item and all its associated batches by item ID.
   *
   * @param dto - Payload with the inventory item ID to delete.
   * @returns An object indicating success.
   * @throws RpcException (404) - If the inventory item is not found.
   */
  async deleteInventoryItem(
    dto: DeleteInventoryItemReqDto,
  ): Promise<DeleteInventoryItemResDto> {
    const item = await this.repo.getInventoryItem(dto.id);
    if (!item)
      throw new RpcException({
        message: 'Inventory item not found',
        status: 404,
      });
    await this.repo.deleteInventoryItem(dto.id);
    return { success: true };
  }

  /**
   * Register a new inventory item slot for an ingredient at a warehouse.
   * Note: The created inventory item starts with zero quantity; initial stock must be added via a restock operation.
   *
   * @param dto - Contains required warehouseId and ingredientId.
   * @returns The newly created inventory item (zero stock).
   * @throws RpcException (404) - If the specified warehouse or ingredient does not exist.
   */
  async createInventoryItem(
    dto: CreateInventoryItemReqDto,
  ): Promise<CreateInventoryItemResDto> {
    const [ingredient, warehouse] = await Promise.allSettled([
      this.repo.getIngredient(dto.ingredientId),
      this.repo.getWarehouse(dto.warehouseId),
    ]);
    if (
      warehouse.status === 'rejected' ||
      !('value' in warehouse) ||
      !warehouse.value
    )
      throw new RpcException({ message: 'Warehouse not found', status: 404 });
    if (
      ingredient.status === 'rejected' ||
      !('value' in ingredient) ||
      !ingredient.value
    )
      throw new RpcException({ message: 'Ingredient not found', status: 404 });

    const created = await this.repo.createInventoryItem(dto);
    return toInventoryResDto(created);
  }

  /**
   * Consume (deduct) a specific quantity from an inventory item, using FEFO:
   * Deduction occurs from the soonest-expiring active batches first ("First Expiry, First Out").
   *
   * @param dto - Contains inventory item ID and quantity to consume.
   * @returns Updated inventory item reflecting the deduction.
   * @throws RpcException (404) - If the inventory item is not found.
   * @throws RpcException (400) - If requested quantity exceeds available stock.
   */
  async consumeInventoryItem(
    dto: ConsumeInventoryItemReqDto,
  ): Promise<ConsumeInventoryItemResDto> {
    const item = await this.repo.getInventoryItem(dto.id);
    if (!item)
      throw new RpcException({
        message: 'Inventory item not found',
        status: 404,
      });

    // Calculate total available from all active batches
    const totalAvailable = item.batches
      .filter((b) => b.status === 'ACTIVE')
      .reduce((sum, b) => sum + b.remainingQuantity, 0);

    if (totalAvailable < dto.consumedQuantity)
      throw new RpcException({
        message: `Insufficient stock: need ${dto.consumedQuantity}, have ${totalAvailable}`,
        status: 400,
      });

    const updated = await this.repo.consumeInventoryItem(dto);
    return toInventoryResDto(updated);
  }

  /**
   * Restock an inventory item by adding a new StockBatch entry.
   * Updates the item's total available quantity to reflect the new batch.
   *
   * @param dto - Contains inventory item ID, restock details (including batch size, units, expiry, etc).
   * @returns The inventory item after restocking.
   * @throws RpcException (404) - If the inventory item is not found.
   */
  async restockInventoryItem(
    dto: RestockInventoryItemReqDto,
  ): Promise<RestockInventoryItemResDto> {
    const item = await this.repo.getInventoryItem(dto.id);
    if (!item)
      throw new RpcException({
        message: 'Inventory item not found',
        status: 404,
      });

    const updated = await this.repo.restockInventoryItem(dto);
    return toInventoryResDto(updated);
  }

  /**
   * Update inventory item metadata (e.g., minimumQuantity, ingredientId).
   * This does NOT update stock levels; use consume/restock for stock changes.
   *
   * @param dto - Contains inventory item ID and fields to update.
   * @returns The updated inventory item metadata.
   * @throws RpcException (404) - If the inventory item is not found.
   */
  async updateInventoryItem(
    dto: UpdateInventoryItemReqDto,
  ): Promise<UpdateInventoryItemResDto> {
    const item = await this.repo.getInventoryItem(dto.id!);
    if (!item)
      throw new RpcException({
        message: 'Inventory item not found',
        status: 404,
      });

    const updated = await this.repo.updateInventoryItem(dto);
    return toInventoryResDto(updated);
  }

  // svc-warehouse.service.ts

  async deductForOrder(
    dto: DeductForOrderReqDto,
  ): Promise<DeductForOrderResDto> {
    try {
      const warehouse = await this.repo.getWarehouseByBranch(dto.branchId);
      if (!warehouse) throw new Error('No warehouse found for this branch');

      const menuItemIds = dto.items.map((i) => i.menuItemId);
      const recipes = await this.repo.getRecipesForMenuItems(menuItemIds);

      // Aggregate total consumption per ingredient across all ordered items
      const consumptionMap = new Map<string, number>();
      for (const recipe of recipes) {
        const ordered = dto.items.find(
          (i) => i.menuItemId === recipe.menuItemId,
        );
        if (!ordered) continue;
        const needed = recipe.quantityRequired * ordered.quantity;
        consumptionMap.set(
          recipe.ingredientId,
          (consumptionMap.get(recipe.ingredientId) ?? 0) + needed,
        );
      }

      const inventoryItems = await this.repo.getInventoryItemsByIngredients(
        warehouse.id,
        [...consumptionMap.keys()],
      );

      const inventoryMap = new Map(
        inventoryItems.map((i) => [i.ingredientId, i]),
      );

      // All deductions in one local DB transaction
      await this.repo.deductBatch(consumptionMap, inventoryMap);

      return { success: true };
    } catch (error) {
      // Return structured failure — Order service decides what to do
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Deduction failed',
      };
    }
  }

  async createIngredient(dto: IngredientDto): Promise<IngredientDto> {
    const existing = await this.repo.findIngredientByName(dto.name);
    if (existing) {
      throw new RpcException({
        message: 'Ingredient already exists',
        status: 409,
      });
    }
    const created = await this.repo.createIngredient(dto);
    return created;
  }

  async getIngredients() {
    const ingredients = await this.repo.getIngredients();
    if (!ingredients) {
      throw new RpcException({
        message: 'Ingredient not found',
        status: 404,
      });
    }
    return ingredients;
  }
}
