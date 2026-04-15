import { CreateOrderDto, UpdateOrderDto } from '@app/common';
import { PrismaService } from '@app/db';
import { Inject, Injectable } from '@nestjs/common';
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

  async createOrder(branchId: number, data: CreateOrderDto, userId: number) {
    try {
      if (!data)
        throw new RpcException({
          statusCode: 400,
          message: 'Invalid request payload',
        });

      const { items = [], status = OrderState.PENDING, CustomerName } = data;
      const bId = Number(branchId);
      const uId = Number(userId);

      if (!items?.length)
        throw new RpcException({
          statusCode: 400,
          message: 'Order must contain at least one item.',
        });
      if (isNaN(bId) || isNaN(uId))
        throw new RpcException({
          statusCode: 400,
          message: 'Invalid Branch or User ID',
        });

      const [branch, user] = await Promise.all([
        this.prisma.branch.findUnique({ where: { id: bId } }),
        this.prisma.user.findUnique({ where: { id: uId } }),
      ]);

      if (!branch)
        throw new RpcException({
          statusCode: 404,
          message: `Branch ${bId} not found`,
        });
      if (!user)
        throw new RpcException({
          statusCode: 404,
          message: `User ${uId} not found`,
        });

      const finalCustomerName = CustomerName || user.fullName;

      const menuItems = await this.prisma.branchMenuItem.findMany({
        where: {
          menuItemId: { in: items.map((i) => i.menuItemId) },
          branchId: bId,
        },
        include: { variations: true },
      });

      let calculatedTotal = 0;
      let calculatedItemCount = 0;

      const orderItemsData = items.map((itemInput) => {
        const dbItem = menuItems.find(
          (m) => m.menuItemId === itemInput.menuItemId,
        );

        if (!dbItem) {
          throw new RpcException({
            statusCode: 400,
            message: `Item ${itemInput.menuItemId} not found.`,
          });
        }

        const unitPrice = Number(dbItem.variations[0]?.price || 0);
        calculatedTotal += unitPrice * itemInput.quantity;
        calculatedItemCount += itemInput.quantity;

        return {
          menuItemId: dbItem.id,
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
          status,
          CustomerName: finalCustomerName,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      this.kafkaClient.emit('order.created', newOrder);
      return newOrder;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateOrder(orderId: number, data: UpdateOrderDto) {
    try {
      const existingOrder = await this.prisma.order.findUnique({
        where: { id: Number(orderId) },
      });

      if (!existingOrder)
        throw new RpcException({
          statusCode: 404,
          message: `Order ${orderId} not found`,
        });
      if (existingOrder.status !== OrderState.PENDING) {
        throw new RpcException({
          statusCode: 400,
          message: `Order already ${existingOrder.status}`,
        });
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
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteOrder(orderId: number) {
    try {
      await this.prisma.order.delete({ where: { id: Number(orderId) } });
      this.kafkaClient.emit('order.deleted', { id: orderId });
      return { message: `Order ${orderId} deleted successfully` };
    } catch (error) {
      this.handleError(error);
    }
  }

  async getOrdersByBranch(
    branchId: number,
    page = 1,
    limit = 10,
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

    try {
      return await this.prisma.$transaction(
        async (tx) => {
          const total = await tx.order.count({ where });
          const orders = await tx.order.findMany({
            where,
            skip,
            take: limit,
            include: {
              items: { include: { branchMenuItem: true } },
              user: { select: { id: true, fullName: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
          });
          return createPagination(orders, total, page, limit);
        },
        { timeout: 10000 },
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async getOrderById(orderId: number) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: Number(orderId) },
        include: { items: true, user: true },
      });
      if (!order)
        throw new RpcException({ statusCode: 404, message: 'Order not found' });
      return order;
    } catch (error) {
      this.handleError(error);
    }
  }

  // TODO: make this more generic and reusable across the app, maybe as a global exception filter or a base service class method
  private handleError(error: unknown) {
    if (error instanceof RpcException) {
      throw error;
    }

    const err = error as Record<string, unknown>;

    if (err?.code === 'P2025') {
      throw new RpcException({ statusCode: 404, message: 'Record not found' });
    }

    if (err?.code === 'P2002') {
      throw new RpcException({
        statusCode: 409,
        message: 'Unique constraint failed',
      });
    }

    const status = typeof err?.status === 'number' ? err.status : 500;
    const message =
      typeof err?.message === 'string' ? err.message : 'Internal Server Error';

    throw new RpcException({
      statusCode: status,
      message: message,
    });
  }
}
