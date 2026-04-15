import { CreateOrderDto, UpdateOrderDto } from '@app/common';
import { BRANCH_TOPICS } from '@app/common/topics/branch.topics';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderState, source } from 'libs/db/generated/client/enums';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(BRANCH_TOPICS.ORDER_CREATE)
  async createOrder(
    @Payload('branchId') branchId: string,
    @Payload('data') data: CreateOrderDto,
    @Payload('userId') userId: string,
  ) {
    return this.orderService.createOrder(branchId, data, userId);
  }

  @MessagePattern(BRANCH_TOPICS.ORDER_GET_STATUSES) // Ensure this topic exists in your constants
  async getOrderStatuses(@Payload('branchId') branchId: string) {
    return this.orderService.getOrderStatuses(branchId);
  }

  @MessagePattern(BRANCH_TOPICS.ORDER_UPDATE)
  async updateOrder(
    @Payload('orderId') orderId: string,
    @Payload('data') data: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(orderId, data);
  }

  @MessagePattern(BRANCH_TOPICS.ORDER_DELETE)
  async deleteOrder(@Payload('orderId') orderId: string) {
    return this.orderService.deleteOrder(orderId);
  }

  @MessagePattern(BRANCH_TOPICS.ORDER_GET_ALL)
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

  @MessagePattern(BRANCH_TOPICS.ORDER_GET_BY_ID)
  async getOrderById(@Payload('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }
}
