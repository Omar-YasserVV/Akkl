import { WAREHOUSE_TOPICS } from '@app/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

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
import { SvcWarehouseService } from './svc-warehouse.service';

@Controller()
export class SvcWarehouseController {
  constructor(private readonly svcWarehouseService: SvcWarehouseService) {}

  @MessagePattern(WAREHOUSE_TOPICS.GET_INVENTORY_ITEM)
  async getInventoryItem(
    @Payload() data: GetInventoryItemReqDto,
  ): Promise<GetInventoryItemResDto> {
    return await this.svcWarehouseService.getInventoryItem({ id: data.id });
  }

  @MessagePattern(WAREHOUSE_TOPICS.DELETE_INVENTORY_ITEM)
  async deleteInventoryItem(
    @Payload() data: DeleteInventoryItemReqDto,
  ): Promise<DeleteInventoryItemResDto> {
    return await this.svcWarehouseService.deleteInventoryItem({ id: data.id });
  }

  @MessagePattern(WAREHOUSE_TOPICS.CREATE_INVENTORY_ITEM)
  async createInventoryItem(
    @Payload() data: CreateInventoryItemReqDto,
  ): Promise<CreateInventoryItemResDto> {
    const { ingredientId, minimumQuantity, quantity, warehouseId } = data;

    return await this.svcWarehouseService.createInventoryItem({
      ingredientId,
      minimumQuantity,
      quantity,
      warehouseId,
    });
  }
}
