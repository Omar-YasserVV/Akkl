import {
  BranchMenuItemDetailDto,
  CreateOrderDto,
  CreateReservationDto,
  CreateTableDto,
  InitializeBranchDto,
  UpdateBranchDto,
  UpdateBranchMenuItemDto,
  UpdateOnboardingDto,
  UpdateOrderDto,
} from '@app/common';
import { MenuPaginationDto } from '@app/common/dtos/MenuDto/list.menu.dto';
import { OrdersPaginationDto } from '@app/common/dtos/OrderDto/list.order.dto';
import { BRANCH_TOPICS } from '@app/common/topics/branch.topics';
import { GetBranchId } from '@app/guards/branch-id.decorator';
import { CurrentUser } from '@app/guards/current-user.decorator';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { RolesGuard } from '@app/guards/role.guard';
import { Roles } from '@app/guards/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import {
  OrderSource,
  OrderState,
  TableStatus,
  UserRole,
} from 'libs/db/generated/client/client';
import { lastValueFrom } from 'rxjs';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('branches')
export class BranchController implements OnModuleInit {
  constructor(
    @Inject('BRANCH_SERVICE') private readonly branchClient: ClientKafka,
  ) {}

  async onModuleInit() {
    Object.values(BRANCH_TOPICS).forEach((topic) => {
      this.branchClient.subscribeToResponseOf(topic);
    });

    await this.branchClient.connect();
  }

  // ---------------- BRANCH ----------------
  @Roles(UserRole.BUSINESS_OWNER)
  @Post('initialize/:restaurantId')
  async initializeBranch(
    @Body() dto: InitializeBranchDto,
    @Param('restaurantId') restaurantId: string,
    @Res() res: Response,
  ) {
    const result = await lastValueFrom<any>(
      this.branchClient.send(BRANCH_TOPICS.INITIALIZE, {
        restaurantId,
        dto,
      }),
    );

    return res.status(HttpStatus.CREATED).json({
      message: 'Branch draft created',
      data: result,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER)
  @Patch('onboarding')
  async updateOnboardingProgress(
    @GetBranchId() branchId: string,
    @Body() dto: UpdateOnboardingDto,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.UPDATE_ONBOARDING, {
      branchId,
      data: dto,
    });
  }

  @Roles(
    UserRole.BUSINESS_OWNER,
    UserRole.CASHIER,
    UserRole.MANAGER,
    UserRole.CUSTOMER,
  )
  @Get('orders/mine')
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  getUserOrders(
    @CurrentUser('sub') userId: string,
    @Query() pagination: OrdersPaginationDto,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.GET_USER_ORDERS, {
      userId,
      pagination: {
        page: Number(pagination.page) || 1,
        limit: Number(pagination.limit) || 10,
      },
    });
  }
  @Roles(UserRole.BUSINESS_OWNER)
  @Post('finalize')
  async finalizeBranch(@GetBranchId() branchId: string) {
    return this.branchClient.send(BRANCH_TOPICS.FINALIZE, {
      branchId,
    });
  }

  // ---------------- STANDARD BRANCH OPERATIONS ----------------

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Get('restaurant/:restaurantId')
  getBranches(@Param('restaurantId') restaurantId: string) {
    return this.branchClient.send(BRANCH_TOPICS.GET_ALL, restaurantId);
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Get('details')
  getBranchById(@GetBranchId() branchId: string) {
    return this.branchClient.send(BRANCH_TOPICS.GET_BY_ID, {
      branchId,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Patch('update')
  updateBranch(@GetBranchId() branchId: string, @Body() dto: UpdateBranchDto) {
    return this.branchClient.send(BRANCH_TOPICS.UPDATE, {
      branchId,
      data: dto,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Delete('delete')
  deleteBranch(@GetBranchId() branchId: string) {
    return this.branchClient.send(BRANCH_TOPICS.DELETE, {
      branchId,
    });
  }

  // ---------------- MENU ----------------

  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
  @Get('menu/summary')
  getMenuSummary(@GetBranchId() branchId: string) {
    return this.branchClient.send(BRANCH_TOPICS.GET_MENU_SUMMARY, {
      branchId,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
  @Get('menu/all')
  getAllMenuItems(@GetBranchId() branchId: string) {
    return this.branchClient.send(BRANCH_TOPICS.GET_ALL_MENU_ITEMS, {
      branchId,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('menu')
  getBranchMenu(
    @GetBranchId() branchId: string,
    @Query() pagination: MenuPaginationDto,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.GET_MENU, {
      branchId,
      pagination: {
        page: Number(pagination.page) || 1,
        limit: Number(pagination.limit) || 10,
        category: pagination.category,
        isAvailable: pagination.isAvailable,
      },
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Post('menu')
  createMenuItem(
    @GetBranchId() branchId: string,
    @Body() data: BranchMenuItemDetailDto,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.CREATE_MENU, {
      branchId,
      data,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Post('menu/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMenuExcel(
    @GetBranchId() branchId: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'No file uploaded' });
    }

    try {
      const result = await lastValueFrom(
        this.branchClient.send(BRANCH_TOPICS.UPLOAD_MENU, {
          branchId,
          fileBuffer: file.buffer,
        }),
      );

      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const status =
        (error as any)?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(status).json({
        message: (error as any)?.message || 'Gateway Timeout or Internal Error',
      });
    }
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Patch('menu/:menuItemId')
  updateMenuItem(
    @GetBranchId() branchId: string,
    @Param('menuItemId') id: string,
    @Body() data: UpdateBranchMenuItemDto,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.UPDATE_MENU, {
      branchId,
      id,
      data,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Delete('menu/:menuItemId')
  deleteMenuItem(
    @GetBranchId() branchId: string,
    @Param('menuItemId') id: string,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.DELETE_MENU, {
      id,
      branchId,
    });
  }

  // ---------------- ORDERS ----------------

  @Roles(
    UserRole.BUSINESS_OWNER,
    UserRole.CASHIER,
    UserRole.MANAGER,
    UserRole.CUSTOMER,
  )
  @Post('orders')
  createOrder(
    @GetBranchId() branchId: string,
    @Body() data: CreateOrderDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.CREATE_ORDER, {
      branchId,
      data,
      userId,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
  @Get('orders/stats')
  getOrderStats(@GetBranchId() branchId: string) {
    return this.branchClient.send(BRANCH_TOPICS.GET_ORDER_STATUSES, {
      branchId,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
  @Get('orders')
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  @ApiQuery({ name: 'source', enum: OrderSource, required: false })
  @ApiQuery({ name: 'status', enum: OrderState, required: false })
  getOrdersByBranch(
    @GetBranchId() branchId: string,
    @Query() pagination: OrdersPaginationDto,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.GET_ALL_ORDERS, {
      branchId,
      pagination: {
        page: Number(pagination.page) || 1,
        limit: Number(pagination.limit) || 10,
        status: pagination.status,
        source: pagination.source,
      },
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
  @Get('orders/:orderId')
  getOrderById(@Param('orderId') orderId: string) {
    return this.branchClient.send(BRANCH_TOPICS.GET_ORDER_BY_ID, { orderId });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Patch('orders/:orderId')
  updateOrder(@Param('orderId') orderId: string, @Body() data: UpdateOrderDto) {
    return this.branchClient.send(BRANCH_TOPICS.UPDATE_ORDER, {
      orderId,
      data,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Delete('orders/:orderId')
  deleteOrder(@Param('orderId') orderId: string) {
    return this.branchClient.send(BRANCH_TOPICS.DELETE_ORDER, { orderId });
  }

  // ---------------- TABLES / FLOOR PLAN ----------------

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Post('tables')
  createTable(@GetBranchId() branchId: string, @Body() data: CreateTableDto) {
    return this.branchClient.send(BRANCH_TOPICS.CREATE_TABLE, {
      branchId,
      data,
    });
  }

  @Roles(
    UserRole.BUSINESS_OWNER,
    UserRole.MANAGER,
    UserRole.WAITER,
    UserRole.CASHIER,
  )
  @Get('tables')
  @ApiQuery({ name: 'zoneName', type: String, required: false })
  getBranchTables(
    @GetBranchId() branchId: string,
    @Query('zoneName') zoneName?: string,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.GET_BRANCH_TABLES, {
      branchId,
      zoneName,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER, UserRole.WAITER)
  @Patch('tables/:tableId/status')
  updateTableStatus(
    @GetBranchId() branchId: string,
    @Param('tableId') tableId: string,
    @Body('status') status: TableStatus,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.UPDATE_TABLE_STATUS, {
      branchId,
      tableId,
      status,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Delete('tables/:tableId')
  deleteTable(
    @GetBranchId() branchId: string,
    @Param('tableId') tableId: string,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.DELETE_TABLE, {
      branchId,
      tableId,
    });
  }

  // ---------------- RESERVATIONS ----------------

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER, UserRole.CASHIER)
  @Post('reservations')
  createReservation(
    @GetBranchId() branchId: string,
    @Body() data: CreateReservationDto,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.CREATE_RESERVATION, {
      branchId,
      data,
    });
  }

  @Roles(
    UserRole.BUSINESS_OWNER,
    UserRole.MANAGER,
    UserRole.CASHIER,
    UserRole.WAITER,
  )
  @Get('reservations/daily')
  @ApiQuery({
    name: 'date',
    type: String,
    required: false,
    description: 'ISO Date string YYYY-MM-DD',
  })
  getDailyReservations(
    @GetBranchId() branchId: string,
    @Query('date') date?: string,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.GET_DAILY_RESERVATIONS, {
      branchId,
      date,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Patch('reservations/:reservationId/cancel')
  cancelReservation(
    @GetBranchId() branchId: string,
    @Param('reservationId') reservationId: string,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.CANCEL_RESERVATION, {
      branchId,
      reservationId,
    });
  }
}
