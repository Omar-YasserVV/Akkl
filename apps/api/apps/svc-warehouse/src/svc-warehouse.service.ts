import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import {
  CreateInventoryItemReqDto,
  CreateInventoryItemResDto,
} from './dto/inventory/inventory.create.dto';
import {
  DeleteInventoryItemReqDto,
  DeleteInventoryItemResDto,
} from './dto/inventory/inventory.delete.dto';
import {
  GetInventoryItemReqDto,
  GetInventoryItemResDto,
} from './dto/inventory/inventory.get.dto';
import { toInventoryResDto } from './mappers/inventory.mapper';
import { WarehouseRepository } from './warehouse.repository';

@Injectable()
export class SvcWarehouseService {
  private readonly logger = new Logger(SvcWarehouseService.name);

  constructor(private readonly repo: WarehouseRepository) {}

  async getInventoryItem(
    dto: GetInventoryItemReqDto,
  ): Promise<GetInventoryItemResDto> {
    this.logger.debug(`Fetching inventory item with id: ${dto.id}`);
    const item = await this.repo.getInventoryItem(dto.id);
    if (!item) {
      this.logger.warn(`Inventory item not found: ${dto.id}`);
      throw new RpcException({
        message: 'Inventory item not found',
        status: 404,
      });
    }
    return toInventoryResDto(item);
  }

  async deleteInventoryItem(
    dto: DeleteInventoryItemReqDto,
  ): Promise<DeleteInventoryItemResDto> {
    this.logger.debug(`Attempting to delete inventory item: ${dto.id}`);
    const item = await this.repo.getInventoryItem(dto.id);
    if (!item) {
      this.logger.warn(`Delete failed. Inventory item not found: ${dto.id}`);
      throw new RpcException({
        message: 'Inventory item not found',
        status: 404,
      });
    }
    await this.repo.deleteInventoryItem(dto.id);
    this.logger.log(`Successfully deleted inventory item: ${dto.id}`);
    return { success: true };
  }

  async createInventoryItem(
    dto: CreateInventoryItemReqDto,
  ): Promise<CreateInventoryItemResDto> {
    const { ingredientId, warehouseId } = dto;

    this.logger.debug(
      `Creating inventory item with ingredientId: ${ingredientId} in warehouseId: ${warehouseId}`,
    );
    const [ingredient, warehouse] = await Promise.allSettled([
      this.repo.getIngredient(ingredientId),
      this.repo.getWarehouse(warehouseId),
    ]);

    if (!warehouse) {
      this.logger.warn(
        `Cannot create inventory item. Warehouse not found: ${warehouseId}`,
      );
      throw new RpcException({
        message: 'Warehouse not found',
        status: 404,
      });
    }

    if (!ingredient) {
      this.logger.warn(
        `Cannot create inventory item. Ingredient not found: ${ingredientId}`,
      );
      throw new RpcException({
        message: 'Ingredient not found',
        status: 404,
      });
    }

    const createdItem = await this.repo.createInventoryItem(dto);
    this.logger.log(`Inventory item created with id: ${createdItem.id}`);
    return toInventoryResDto(createdItem);
  }
}
