import { WAREHOUSE_TOPICS } from '@app/common';
import { GetBranchId } from '@app/guards/branch-id.decorator';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { RolesGuard } from '@app/guards/role.guard';
import { Roles } from '@app/guards/roles.decorator';
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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IngredientDto } from 'apps/svc-warehouse/src/dto/inventory/Inventory.base.dto';
import { CreateIngredientReqDto } from 'apps/svc-warehouse/src/dto/inventory/ingredient.create.dto';
import {
  CreateInventoryItemReqDto,
  CreateInventoryItemResDto,
} from 'apps/svc-warehouse/src/dto/inventory/inventory.create.dto';
import {
  GetStockAlertsReqDto,
  GetStockAlertsResDto,
} from 'apps/svc-warehouse/src/dto/inventory/inventory.alerts.dto';
import {
  GetInventoryLogsReqDto,
  GetInventoryLogsResDto,
} from 'apps/svc-warehouse/src/dto/inventory/inventory.logs.dto';
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
import { GetWarehouseByBranchResDto } from 'apps/svc-warehouse/src/dto/warehouse/warehouse.by-branch.dto';
import { UserRole } from 'libs/db/generated/client/enums';
import { lastValueFrom } from 'rxjs';

@UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER, UserRole.CASHIER)
  @Get('current')
  async getCurrentWarehouse(
    @GetBranchId() branchId: string,
  ): Promise<GetWarehouseByBranchResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.GET_WAREHOUSE_BY_BRANCH, {
        branchId,
      }),
    );
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER, UserRole.CASHIER)
  @Get('inventory-item/:id')
  async getInventoryItem(
    @Param('id') id: string,
  ): Promise<GetInventoryItemResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.GET_INVENTORY_ITEM, { id }),
    );
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER, UserRole.CASHIER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('inventory-items')
  async listInventoryItems(
    @Query() query: ListInventoryItemsReqDto,
  ): Promise<ListInventoryItemsResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.LIST_INVENTORY_ITEMS, query),
    );
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Post('inventory-item')
  async createInventoryItem(
    @Body() data: CreateInventoryItemReqDto,
  ): Promise<CreateInventoryItemResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.CREATE_INVENTORY_ITEM, data),
    );
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Delete('inventory-item/:id')
  async deleteInventoryItem(
    @Param('id') id: string,
  ): Promise<DeleteInventoryItemResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.DELETE_INVENTORY_ITEM, { id }),
    );
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Post('inventory-item/:id/consume')
  async consumeInventoryItem(
    @Param('id') id: string,
    @Body() data: ConsumeInventoryItemReqDto,
  ): Promise<ConsumeInventoryItemResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.CONSUME_INVENTORY_ITEM, {
        id,
        consumedQuantity: data.consumedQuantity,
      }),
    );
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Post('inventory-item/:id/restock')
  async restockInventoryItem(
    @Param('id') id: string,
    @Body() data: RestockInventoryItemReqDto,
  ): Promise<RestockInventoryItemResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.RESTOCK_INVENTORY_ITEM, {
        id,
        addedQuantity: data.addedQuantity,
        numberOfUnits: data.numberOfUnits,
        unitSize: data.unitSize,
        expiresAt: data.expiresAt,
      }),
    );
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
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

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Post('ingredients')
  async createIngredient(
    @Body() data: CreateIngredientReqDto,
  ): Promise<IngredientDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.CREATE_INGREDIENT, data),
    );
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER, UserRole.CASHIER)
  @Get('ingredients')
  async getIngredients() {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.GET_INGREDIENTS, {}),
    );
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER, UserRole.CASHIER)
  @Get('alerts')
  async getStockAlerts(
    @Query() query: GetStockAlertsReqDto,
  ): Promise<GetStockAlertsResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.GET_STOCK_ALERTS, query),
    );
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER, UserRole.CASHIER)
  @Get('logs')
  async getInventoryLogs(
    @Query() query: GetInventoryLogsReqDto,
  ): Promise<GetInventoryLogsResDto> {
    return lastValueFrom(
      this.warehouseClient.send(WAREHOUSE_TOPICS.GET_INVENTORY_LOGS, query),
    );
  }
}
