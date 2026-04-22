import { CreateOrderDto, UpdateOrderDto } from '@app/common';
import { OrdersPaginationDto } from '@app/common/dtos/OrderDto/list.order.dto';
import { BRANCH_TOPICS } from '@app/common/topics/branch.topics';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(BRANCH_TOPICS.CREATE_ORDER)
  async createOrder(
    @Payload('branchId') branchId: string,
    @Payload('data') data: CreateOrderDto,
    @Payload('userId') userId: string,
  ) {
    return this.orderService.createOrder(branchId, data, userId);
  }

  @MessagePattern(BRANCH_TOPICS.GET_ORDER_STATUSES)
  async getOrderStatuses(@Payload('branchId') branchId: string) {
    return this.orderService.getOrderStatuses(branchId);
  }

  @MessagePattern(BRANCH_TOPICS.UPDATE_ORDER)
  async updateOrder(
    @Payload('orderId') orderId: string,
    @Payload('data') data: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(orderId, data);
  }

  @MessagePattern(BRANCH_TOPICS.DELETE_ORDER)
  async deleteOrder(@Payload('orderId') orderId: string) {
    return this.orderService.deleteOrder(orderId);
  }

  @MessagePattern(BRANCH_TOPICS.GET_ALL_ORDERS)
  async getOrdersByBranch(
    @Payload('branchId') branchId: string,
    @Payload('pagination') pagination: OrdersPaginationDto,
  ) {
    return this.orderService.getOrdersByBranch({
      branchId,
      pagination: {
        page: Number(pagination.page) || 1,
        limit: Number(pagination.limit) || 10,
        status: pagination.status,
        source: pagination.source,
      },
    });
  }

  @MessagePattern(BRANCH_TOPICS.GET_ORDER_BY_ID)
  async getOrderById(@Payload('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }
}
