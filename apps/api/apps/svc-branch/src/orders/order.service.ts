import { CreateOrderDto, UpdateOrderDto } from '@app/common';
import { PrismaService } from '@app/db';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { Prisma } from 'libs/db/generated/client/client';
import { OrderState, source } from 'libs/db/generated/client/enums';

import { createPagination } from 'utils/pagination.util';
@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('BRANCH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async createOrder(branchId: number, data: CreateOrderDto) {
    if (!data) {
      throw new RpcException('Invalid request payload');
    }

    const { items = [], userId, status = 'PENDING', CustomerName } = data;
    const bId = Number(branchId);
    const uId = Number(userId);

    if (!items || items.length === 0) {
      throw new RpcException('Order must contain at least one item.');
    }

    if (isNaN(bId) || isNaN(uId)) {
      throw new RpcException('Invalid Branch ID or User ID');
    }

    try {
      const [branch, user] = await Promise.all([
        this.prisma.branch.findUnique({ where: { id: bId } }),
        this.prisma.user.findUnique({ where: { id: uId } }),
      ]);

      if (!branch) throw new RpcException(`Branch ${bId} not found`);
      if (!user) throw new RpcException(`User ${uId} not found`);

      const finalCustomerName = CustomerName || user.fullName;

      const menuItems = await this.prisma.branchMenuItem.findMany({
        where: {
          id: { in: items.map((i) => i.menuItemId) },
          branchId: bId,
        },
        include: { variations: true },
      });

      let calculatedTotal = 0;
      let calculatedItemCount = 0;

      const orderItemsData = items.map((itemInput) => {
        const dbItem = menuItems.find((m) => m.id === itemInput.menuItemId);

        if (!dbItem) {
          throw new RpcException(
            `Item ${itemInput.menuItemId} is not available at this branch.`,
          );
        }

        const unitPrice = Number(dbItem.variations[0]?.price || 0);
        calculatedTotal += unitPrice * itemInput.quantity;
        calculatedItemCount += itemInput.quantity;

        return {
          menuItemId: itemInput.menuItemId,
          quantity: itemInput.quantity,
          price: unitPrice,
        };
      });

      const newOrder = await this.prisma.order.create({
        data: {
          totalPrice: calculatedTotal,
          userId: uId,
          branchId: bId,
          itemCount: calculatedItemCount,
          status: status,
          CustomerName: finalCustomerName,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      this.kafkaClient.emit('order.created', newOrder);
      return newOrder;
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  async updateOrder(orderId: number, data: UpdateOrderDto) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id: Number(orderId) },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (existingOrder.status !== 'PENDING') {
      throw new BadRequestException(
        `Order cannot be updated because it is already ${existingOrder.status}`,
      );
    }

    const { items, ...updateData } = data;

    const updatedOrder = await this.prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        ...updateData,
        ...(items && {
          items: {
            deleteMany: {},
            create: items.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        }),
      },
      include: { items: true },
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

  async getOrdersByBranch(
    branchId: number,
    page: number = 1,
    limit: number = 10,
    status?: OrderState,
    orderSource?: source,
  ) {
    const skip = (page - 1) * limit;
    const bId = Number(branchId);

    const where: Prisma.OrderWhereInput = {
      branchId: bId,
      ...(status && { status }),
      ...(orderSource && { source: orderSource }),
    };

    const [total, orders] = await this.prisma.$transaction([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: {
            include: { branchMenuItem: true },
          },
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return createPagination(orders, total, page, limit);
  }

  async getOrderById(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: Number(orderId) },
    });
  }
}
