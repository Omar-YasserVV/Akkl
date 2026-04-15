import {
  BranchMenuItemDetailDto,
  CreateBranchDto,
  CreateOrderDto,
  UpdateBranchDto,
  UpdateBranchMenuItemDto,
  UpdateOrderDto,
} from '@app/common';
import { BRANCH_TOPICS } from '@app/common/topics/branch.topics';
import {
  BranchContext,
  GetBranchContext,
} from '@app/guards/branch-id.decorator';
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
import { ApiQuery } from '@nestjs/swagger';
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

  // --- Branch Endpoints ---

  @Roles(UserRole.BUSINESS_OWNER)
  @Post(':restaurantId')
  async createBranch(
    @Body() dto: CreateBranchDto,
    @GetBranchContext() context: BranchContext,
    @Res() res: Response,
  ) {
    const result = await lastValueFrom<{ message?: string }>(
      this.branchClient.send('create-branch', {
        restaurantId: context.restaurantId,
        dto,
      }),
    );

    if (result instanceof Error) {
      return res.status(HttpStatus.CONFLICT).json({ message: result.message });
    }
    return res.status(HttpStatus.CREATED).json({ message: 'Branch created' });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Get(':restaurantId')
  getBranches(@GetBranchContext() context: BranchContext) {
    return this.branchClient.send('get-branches', context.restaurantId);
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Get(':restaurantId/:branchId')
  getBranchById(@GetBranchContext() context: BranchContext) {
    return this.branchClient.send('get-branch-by-id', {
      restaurantId: context.restaurantId,
      branchId: context.branchId,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Patch(':restaurantId/:branchId')
  updateBranch(
    @GetBranchContext() context: BranchContext,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.branchClient.send('update-branch', {
      restaurantId: context.restaurantId,
      branchId: context.branchId,
      data: dto,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Delete(':restaurantId/:branchId')
  deleteBranch(@GetBranchContext() context: BranchContext) {
    return this.branchClient.send('delete-branch', {
      restaurantId: context.restaurantId,
      branchId: context.branchId,
    });
  }

  // --- Menu Endpoints ---
  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
  @Get(':restaurantId/:branchId/menu')
  getBranchMenu(@GetBranchContext() context: BranchContext) {
    return this.branchClient.send('get_branch_menu', {
      branchId: context.branchId,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Post(':restaurantId/:branchId/menu')
  createMenuItem(
    @GetBranchContext() context: BranchContext,
    @Body() data: BranchMenuItemDetailDto,
  ) {
    return this.branchClient.send('create_menu_item', {
      branchId: context.branchId,
      data,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Post(':restaurantId/:branchId/menu/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadMenuExcel(
    @GetBranchContext() context: BranchContext,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.branchClient.send('upload_menu_excel', {
      restaurantId: context.restaurantId,
      branchId: context.branchId,
      fileBuffer: file.buffer,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Patch(':restaurantId/:branchId/menu/:menuItemId')
  updateMenuItem(
    @GetBranchContext() context: BranchContext,
    @Param('menuItemId') id: number,
    @Body() data: UpdateBranchMenuItemDto,
  ) {
    return this.branchClient.send('update_menu_item', {
      branchId: context.branchId,
      id,
      data,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Delete(':restaurantId/:branchId/menu/:menuItemId')
  deleteMenuItem(
    @GetBranchContext() context: BranchContext,
    @Param('menuItemId') id: number,
  ) {
    return this.branchClient.send('delete_menu_item', {
      id,
      branchId: context.branchId,
    });
  }

  // --- Order Endpoints ---

  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
  @Post(':restaurantId/:branchId/orders')
  @UseGuards(JwtAuthGuard)
  createOrder(
    @GetBranchContext() context: BranchContext,
    @Body() data: CreateOrderDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.branchClient.send('create_order', {
      branchId: Number(context.branchId),
      data,
      userId: Number(userId),
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
  @Get(':restaurantId/:branchId/orders')
  @ApiQuery({
    name: 'source',
    enum: source,
    required: false,
    description: 'Filter orders by their source',
  })
  @ApiQuery({
    name: 'status',
    enum: OrderState,
    required: false,
    description: 'Filter orders by their status',
  })
  getOrdersByBranch(
    @GetBranchContext() context: BranchContext,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: OrderState,
    @Query('source') source?: source,
  ) {
    return this.branchClient.send('get_orders_by_branch', {
      branchId: Number(context.branchId),
      page: Number(page),
      limit: Number(limit),
      status,
      source,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.CASHIER, UserRole.MANAGER)
  @Get(':restaurantId/:branchId/orders/:orderId')
  getOrderById(@Param('orderId') orderId: number) {
    return this.branchClient.send('get_order_by_id', {
      orderId,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Patch(':restaurantId/:branchId/orders/:orderId')
  updateOrder(@Param('orderId') orderId: number, @Body() data: UpdateOrderDto) {
    return this.branchClient.send('update_order', {
      orderId,
      data,
    });
  }

  @Roles(UserRole.BUSINESS_OWNER, UserRole.MANAGER)
  @Delete(':restaurantId/:branchId/orders/:orderId')
  deleteOrder(@Param('orderId') orderId: number) {
    return this.branchClient.send('delete_order', {
      orderId,
    });
  }
}
