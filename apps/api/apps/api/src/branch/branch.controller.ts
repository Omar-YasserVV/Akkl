import {
  BranchMenuItemDetailDto,
  CreateBranchDto,
  CreateOrderDto,
  UpdateBranchDto,
  UpdateBranchMenuItemDto,
  UpdateOrderDto,
} from '@app/common';
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
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { OrderState, source, UserRole } from 'libs/db/generated/client/enums';
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
  @Post('restaurant/:restaurantId')
  async createBranch(
    @Body() dto: CreateBranchDto,
    @Param('restaurantId') restaurantId: string,
    @Res() res: Response,
  ) {
    const result = await lastValueFrom<{ message?: string }>(
      this.branchClient.send(BRANCH_TOPICS.CREATE, {
        restaurantId,
        dto,
      }),
    );

    return res.status(HttpStatus.CREATED).json({
      message: result?.message || 'Branch created',
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Get('restaurant/:restaurantId')
  getBranches(@Param('restaurantId') restaurantId: string) {
    return this.branchClient.send(BRANCH_TOPICS.GET_ALL, restaurantId);
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Get('details/:restaurantId')
  getBranchById(
    @GetBranchId() branchId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.GET_BY_ID, {
      restaurantId,
      branchId,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Patch('details/:restaurantId')
  updateBranch(
    @GetBranchId() branchId: string,
    @Param('restaurantId') restaurantId: string,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.UPDATE, {
      restaurantId,
      branchId,
      data: dto,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Delete('details/:restaurantId')
  deleteBranch(
    @GetBranchId() branchId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.DELETE, {
      restaurantId,
      branchId,
    });
  }

  // ---------------- MENU ----------------

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Get('menu/all')
  getAllMenuItems(@GetBranchId() branchId: string) {
    return this.branchClient.send(BRANCH_TOPICS.GET_ALL_MENU_ITEMS, {
      branchId,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
  @Get('menu')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  getBranchMenu(
    @GetBranchId() branchId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.branchClient.send(BRANCH_TOPICS.GET_MENU, {
      branchId,
      pagination: {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
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
    const result = await lastValueFrom<{ message: string; items: unknown[] }>(
      this.branchClient.send(BRANCH_TOPICS.UPLOAD_MENU, {
        branchId,
        fileBuffer: file.buffer,
      }),
    );

    return res.status(HttpStatus.CREATED).json(result);
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

  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
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
  @ApiQuery({ name: 'source', enum: source, required: false })
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
}
