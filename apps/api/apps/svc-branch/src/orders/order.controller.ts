import { CreateOrderDto, UpdateOrderDto } from '@app/common';
import { BRANCH_TOPICS } from '@app/common/topics/branch.topics';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderState, source } from 'libs/db/generated/client/enums';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('create_order')
  async createOrder(
    @Payload('branchId') branchId: string,
    @Payload('data') data: CreateOrderDto,
    @Payload('userId') userId: string,
  ) {
    return this.orderService.createOrder(branchId, data, userId);
  }

  @MessagePattern(BRANCH_TOPICS.ORDER_GET_STATUSES)
  async getOrderStatuses(@Payload('branchId') branchId: string) {
    return this.orderService.getOrderStatuses(branchId);
  }

  @MessagePattern('update_order')
  async updateOrder(
    @Payload('orderId') orderId: string,
    @Payload('data') data: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(orderId, data);
  }

  @MessagePattern('delete_order')
  async deleteOrder(@Payload('orderId') orderId: string) {
    return this.orderService.deleteOrder(orderId);
  }

  @MessagePattern('get_orders_by_branch')
  async getOrdersByBranch(
    @Payload('branchId') branchId: string,
    @Payload('page') page: number,
    @Payload('limit') limit: number,
    @Payload('status') status?: OrderState,
    @Payload('source') source?: source,
  ) {
    return this.orderService.getOrdersByBranch(
      branchId,
      page,
      limit,
      status,
      source,
    );
  }

  @MessagePattern('get_order_by_id')
  async getOrderById(@Payload('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }
}
