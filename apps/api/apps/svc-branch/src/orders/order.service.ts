import { CreateOrderDto, UpdateOrderDto } from '@app/common';
import { PrismaService } from '@app/db';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('BRANCH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async createOrder(branchId: number, data: CreateOrderDto) {
    // Check if branch exists
    const branch = await this.prisma.branch.findUnique({
      where: { id: Number(branchId) },
    });

    if (!branch) {
      return new Error(`Branch with ID ${branchId} not found`);
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: Number(data.userId) },
    });

    if (!user) {
      return new Error(`User with ID ${data.userId} not found`);
    }

    const newOrder = await this.prisma.order.create({
      data: {
        ...data,
        branchId: Number(branchId),
      },
    });

    this.kafkaClient.emit('order.created', newOrder);
    return newOrder;
  }

  async updateOrder(orderId: number, data: UpdateOrderDto) {
    const updatedOrder = await this.prisma.order.update({
      where: { id: Number(orderId) },
      data,
    });
    this.kafkaClient.emit('order.updated', updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(orderId: number) {
    await this.prisma.order.delete({
      where: { id: Number(orderId) },
    });
    this.kafkaClient.emit('order.deleted', { id: orderId });
    return { message: `Order with ID ${orderId} deleted successfully` };
  }
  async getOrdersByBranch(branchId: number) {
    return this.prisma.order.findMany({
      where: {
        branchId: Number(branchId),
      },
    });
  }

  async getOrderById(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: Number(orderId) },
    });
  }
}
