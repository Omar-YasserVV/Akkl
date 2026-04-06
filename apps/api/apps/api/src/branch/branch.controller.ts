import {
  BranchMenuItemDetailDto,
  CreateBranchDto,
  CreateOrderDto,
  UpdateBranchDto,
  UpdateBranchMenuItemDto,
  UpdateOrderDto,
} from '@app/common';
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
  Res,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';

@Controller('branches')
export class BranchController implements OnModuleInit {
  constructor(
    @Inject('BRANCH_SERVICE') private readonly branchClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // 1. Define the topics your gateway needs to listen to responses from
    const topics = [
      'get-branches',
      'get-branch-by-id',
      'create-branch',
      'update-branch',
      'delete-branch',
      'get_branch_menu',
      'create_menu_item',
      'update_menu_item',
      'delete_menu_item',
      'get_orders_by_branch',
      'get_order_by_id',
      'create_order',
      'update_order',
      'delete_order',
    ];

    // 2. Remove the "Method not implemented" error and replace with registration logic
    topics.forEach((topic) => {
      this.branchClient.subscribeToResponseOf(topic);
    });

    await this.branchClient.connect();
  }

  // --- Branch Endpoints ---

  @Post(':restaurantId')
  async createBranch(
    @Body() dto: CreateBranchDto,
    @Param('restaurantId') restaurantId: number,
    @Res() res: Response,
  ) {
    const result = await lastValueFrom<{ message?: string }>(
      this.branchClient.send('create-branch', { restaurantId, dto }),
    );

    if (result instanceof Error) {
      return res.status(HttpStatus.CONFLICT).json({ message: result.message });
    }
    return res.status(HttpStatus.CREATED).json({ message: 'Branch created' });
  }

  @Get(':restaurantId')
  getBranches(@Param('restaurantId') restaurantId: number) {
    return this.branchClient.send('get-branches', restaurantId);
  }

  @Get(':restaurantId/:branchId')
  getBranchById(
    @Param('restaurantId') restaurantId: number,
    @Param('branchId') branchId: number,
  ) {
    return this.branchClient.send('get-branch-by-id', {
      restaurantId,
      branchId,
    });
  }

  @Patch(':restaurantId/:branchId')
  updateBranch(
    @Param('restaurantId') restaurantId: number,
    @Param('branchId') branchId: number,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.branchClient.send('update-branch', {
      restaurantId,
      branchId,
      data: dto,
    });
  }

  @Delete(':restaurantId/:branchId')
  deleteBranch(
    @Param('restaurantId') restaurantId: number,
    @Param('branchId') branchId: number,
  ) {
    return this.branchClient.send('delete-branch', {
      restaurantId,
      branchId,
    });
  }

  // --- Menu Endpoints ---

  @Get(':restaurantId/:branchId/menu')
  getBranchMenu(@Param('branchId') branchId: number) {
    return this.branchClient.send('get_branch_menu', { branchId });
  }

  @Post(':restaurantId/:branchId/menu')
  createMenuItem(
    @Param('branchId') branchId: number,
    @Body() data: BranchMenuItemDetailDto,
  ) {
    return this.branchClient.send('create_menu_item', { branchId, data });
  }

  @Patch(':restaurantId/:branchId/menu/:menuItemId')
  updateMenuItem(
    @Param('menuItemId') id: number,
    @Body() data: UpdateBranchMenuItemDto,
  ) {
    return this.branchClient.send('update_menu_item', { id, data });
  }

  @Delete(':restaurantId/:branchId/menu/:menuItemId')
  deleteMenuItem(@Param('menuItemId') id: number) {
    return this.branchClient.send('delete_menu_item', { id });
  }

  // --- Order Endpoints ---

  @Post(':restaurantId/:branchId/orders')
  createOrder(
    @Param('branchId') branchId: number,
    @Body() data: CreateOrderDto,
  ) {
    return this.branchClient.send('create_order', { branchId, data });
  }

  @Get(':restaurantId/:branchId/orders')
  getOrdersByBranch(@Param('branchId') branchId: number) {
    return this.branchClient.send('get_orders_by_branch', { branchId });
  }

  @Get(':restaurantId/:branchId/orders/:orderId')
  getOrderById(@Param('orderId') orderId: number) {
    return this.branchClient.send('get_order_by_id', { orderId });
  }

  @Patch(':restaurantId/:branchId/orders/:orderId')
  updateOrder(@Param('orderId') orderId: number, @Body() data: UpdateOrderDto) {
    return this.branchClient.send('update_order', { orderId, data });
  }

  @Delete(':restaurantId/:branchId/orders/:orderId')
  deleteOrder(@Param('orderId') orderId: number) {
    return this.branchClient.send('delete_order', { orderId });
  }
}
