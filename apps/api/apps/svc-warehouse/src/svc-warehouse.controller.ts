// svc-warehouse.controller.ts
import { WAREHOUSE_TOPICS } from '@app/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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
import { SvcWarehouseService } from './svc-warehouse.service';

@Controller()
export class SvcWarehouseController {
  constructor(private readonly svcWarehouseService: SvcWarehouseService) {}

  @MessagePattern(WAREHOUSE_TOPICS.GET_INVENTORY_ITEM)
  async getInventoryItem(
    @Payload() data: GetInventoryItemReqDto,
  ): Promise<GetInventoryItemResDto> {
    return this.svcWarehouseService.getInventoryItem(data);
  }

  @MessagePattern(WAREHOUSE_TOPICS.LIST_INVENTORY_ITEMS)
  async listInventoryItems(
    @Payload() data: ListInventoryItemsReqDto,
  ): Promise<ListInventoryItemsResDto> {
    return this.svcWarehouseService.listInventoryItems(data);
  }

  @MessagePattern(WAREHOUSE_TOPICS.DELETE_INVENTORY_ITEM)
  async deleteInventoryItem(
    @Payload() data: DeleteInventoryItemReqDto,
  ): Promise<DeleteInventoryItemResDto> {
    return this.svcWarehouseService.deleteInventoryItem(data);
  }

  @MessagePattern(WAREHOUSE_TOPICS.CREATE_INVENTORY_ITEM)
  async createInventoryItem(
    @Payload() data: CreateInventoryItemReqDto,
  ): Promise<CreateInventoryItemResDto> {
    return this.svcWarehouseService.createInventoryItem(data);
  }

  @MessagePattern(WAREHOUSE_TOPICS.CONSUME_INVENTORY_ITEM)
  async consumeInventoryItem(
    @Payload() data: ConsumeInventoryItemReqDto,
  ): Promise<ConsumeInventoryItemResDto> {
    return this.svcWarehouseService.consumeInventoryItem(data);
  }

  @MessagePattern(WAREHOUSE_TOPICS.RESTOCK_INVENTORY_ITEM)
  async restockInventoryItem(
    @Payload() data: RestockInventoryItemReqDto,
  ): Promise<RestockInventoryItemResDto> {
    return this.svcWarehouseService.restockInventoryItem(data);
  }

  @MessagePattern(WAREHOUSE_TOPICS.UPDATE_INVENTORY_ITEM)
  async updateInventoryItem(
    @Payload() data: UpdateInventoryItemReqDto,
  ): Promise<UpdateInventoryItemResDto> {
    return this.svcWarehouseService.updateInventoryItem(data);
  }

  @MessagePattern(WAREHOUSE_TOPICS.DEDUCT_FOR_ORDER)
  async deductForOrder(
    @Payload() data: DeductForOrderReqDto,
  ): Promise<DeductForOrderResDto> {
    return this.svcWarehouseService.deductForOrder(data);
  }
}
