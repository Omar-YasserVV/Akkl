import { WAREHOUSE_TOPICS } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CreateInventoryItemReqDto,
  CreateInventoryItemResDto,
} from 'apps/svc-warehouse/src/dto/inventory/inventory.create.dto';
import { DeleteInventoryItemResDto } from 'apps/svc-warehouse/src/dto/inventory/inventory.delete.dto';
import { GetInventoryItemResDto } from 'apps/svc-warehouse/src/dto/inventory/inventory.get.dto';
import {
  ListInventoryItemsReqDto,
  ListInventoryItemsResDto,
} from 'apps/svc-warehouse/src/dto/inventory/inventory.list.dto';
import {
  ConsumeInventoryItemReqDto,
  ConsumeInventoryItemResDto,
  RestockInventoryItemReqDto,
  RestockInventoryItemResDto,
  UpdateInventoryItemReqDto,
  UpdateInventoryItemResDto,
} from 'apps/svc-warehouse/src/dto/inventory/inventory.update.dto';
import { lastValueFrom } from 'rxjs';

@Controller('warehouse')
export class WarehouseController implements OnModuleInit {
  constructor(
    @Inject('WAREHOUSE_SERVICE') private readonly warehouseClient: ClientKafka,
  ) {}

  async onModuleInit() {
    Object.values(WAREHOUSE_TOPICS).forEach((topics) => {
      this.warehouseClient.subscribeToResponseOf(topics);
    });
    await this.warehouseClient.connect();
  }

  @Get('inventory-item/:id')
  async getInventoryItem(
    @Param('id') id: string,
  ): Promise<GetInventoryItemResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.GET_INVENTORY_ITEM, { id }),
    );
  }

  @Get('inventory-items')
  async listInventoryItems(
    @Query() query: ListInventoryItemsReqDto,
  ): Promise<ListInventoryItemsResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.LIST_INVENTORY_ITEMS, query),
    );
  }

  @Post('inventory-item')
  async createInventoryItem(
    @Body() data: CreateInventoryItemReqDto,
  ): Promise<CreateInventoryItemResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.CREATE_INVENTORY_ITEM, data),
    );
  }

  @Delete('inventory-item/:id')
  async deleteInventoryItem(
    @Param('id') id: string,
  ): Promise<DeleteInventoryItemResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.DELETE_INVENTORY_ITEM, { id }),
    );
  }

  @Post('inventory-item/:id/consume')
  async consumeInventoryItem(
    @Param('id') id: string,
    @Body() data: ConsumeInventoryItemReqDto,
  ): Promise<ConsumeInventoryItemResDto> {
    // Only forward the fields needed, as in the service controller
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.CONSUME_INVENTORY_ITEM, {
        id,
        consumedQuantity: data.consumedQuantity,
      }),
    );
  }

  @Post('inventory-item/:id/restock')
  async restockInventoryItem(
    @Param('id') id: string,
    @Body() data: RestockInventoryItemReqDto,
  ): Promise<RestockInventoryItemResDto> {
    // Only forward the fields needed, as in the service controller
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.RESTOCK_INVENTORY_ITEM, {
        id,
        addedQuantity: data.addedQuantity,
      }),
    );
  }

  @Patch('inventory-item/:id')
  async updateInventoryItem(
    @Param('id') id: string,
    @Body() data: UpdateInventoryItemReqDto,
  ): Promise<UpdateInventoryItemResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.UPDATE_INVENTORY_ITEM, {
        ...data,
        id,
      }),
    );
  }
}
