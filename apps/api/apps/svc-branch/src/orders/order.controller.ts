import { CreateOrderDto, UpdateOrderDto } from '@app/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderState, source } from 'libs/db/generated/client/enums';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('create_order')
  async createOrder(
    @Payload('branchId') branchId: number,
    @Payload('data') data: CreateOrderDto,
    @Payload('userId') userId: number, // Matches the key sent by the Gateway
  ) {
    return this.orderService.createOrder(branchId, data, userId);
  }

  @MessagePattern('update_order')
  async updateOrder(
    @Payload('orderId') orderId: number,
    @Payload('data') data: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(orderId, data);
  }

  @MessagePattern('delete_order')
  async deleteOrder(@Payload('orderId') orderId: number) {
    return this.orderService.deleteOrder(orderId);
  }

  @MessagePattern('get_orders_by_branch')
  async getOrdersByBranch(
    @Payload('branchId') branchId: number,
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
  async getOrderById(@Payload('orderId') orderId: number) {
    return this.orderService.getOrderById(orderId);
  }
}
