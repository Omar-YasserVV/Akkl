import { WAREHOUSE_TOPICS } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CreateInventoryItemReqDto,
  CreateInventoryItemResDto,
} from 'apps/svc-warehouse/src/dto/inventory/inventory.create.dto';
import { DeleteInventoryItemResDto } from 'apps/svc-warehouse/src/dto/inventory/inventory.delete.dto';
import { GetInventoryItemResDto } from 'apps/svc-warehouse/src/dto/inventory/inventory.get.dto';
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
}
