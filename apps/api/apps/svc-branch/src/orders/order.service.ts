import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { CreateOrderDto, UpdateOrderDto } from '@app/common';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(BranchId: number, data: CreateOrderDto) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: BranchId },
    });
    if (!branch) {
      throw new Error(`Branch with ID ${BranchId} not found`);
    }

    return this.prisma.order.create({
      data: {
        ...data,
        branchId: BranchId,
      },
    });
  }

  async updateOrder(orderId: number, data: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id: orderId },
      data,
    });
  }

  async deleteOrder(orderId: number) {
    return this.prisma.order.delete({
      where: { id: orderId },
    });
  }

  async getOrdersByBranch(branchId: number) {
    return this.prisma.order.findMany({
      where: { branchId },
    });
  }

  async getOrderById(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
    });
  }
}
