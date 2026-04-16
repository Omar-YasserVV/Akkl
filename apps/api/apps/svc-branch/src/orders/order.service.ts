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

  /**
   * Calculates order statistics for a specific branch.
   */
  async getOrderStatuses(branchId: string) {
    try {
      const stats = await this.prisma.order.groupBy({
        by: ['status'],
        where: { branchId: branchId },
        _count: {
          status: true,
        },
      });

      const formattedStats = stats.reduce(
        (acc, curr) => {
          acc[curr.status] = curr._count.status;
          return acc;
        },
        {} as Record<OrderState, number>,
      );

      // Ensure all enum values are present in the response even if count is 0
      const allStatuses: OrderState[] = Object.values(OrderState);

      allStatuses.forEach((status) => {
        if (!formattedStats[status]) {
          formattedStats[status] = 0;
        }
      });

      return formattedStats;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Creates a new order.
   * Validates branch/user existence and calculates totals based on BranchMenuItem variations.
   */
  async createOrder(branchId: string, data: CreateOrderDto, userId: string) {
    try {
      if (!data)
        throw new RpcException({
          statusCode: 400,
          message: 'Invalid request payload',
        });

      const { items = [], status = OrderState.PENDING, CustomerName } = data;

      if (!items?.length)
        throw new RpcException({
          statusCode: 400,
          message: 'Order must contain at least one item.',
        });

      // 1. Validate Branch and User existence
      const [branch, user] = await Promise.all([
        this.prisma.branch.findUnique({ where: { id: branchId } }),
        this.prisma.user.findUnique({ where: { id: userId } }),
      ]);

      if (!branch)
        throw new RpcException({
          statusCode: 404,
          message: `Branch ${branchId} not found`,
        });
      if (!user)
        throw new RpcException({
          statusCode: 404,
          message: `User ${userId} not found`,
        });

      const menuItems = await this.prisma.branchMenuItem.findMany({
        where: {
          id: { in: items.map((i) => i.menuItemId) },
          branchId: branchId,
        },
        include: { variations: true },
      });

      let calculatedTotal = 0;
      let calculatedItemCount = 0;

      const orderItemsData = items.map((itemInput) => {
        const dbItem = menuItems.find((m) => m.id === itemInput.menuItemId);

        if (!dbItem) {
          throw new RpcException({
            statusCode: 400,
            message: `Item ${itemInput.menuItemId} is not available in this branch menu.`,
          });
        }

        // Logic: Use the first variation price.
        // Note: If your DTO supports specific variation selection (size), update this logic.
        const unitPrice = Number(dbItem.variations[0]?.price || 0);
        calculatedTotal += unitPrice * itemInput.quantity;
        calculatedItemCount += itemInput.quantity;

        return {
          menuItemId: dbItem.id, // Links to BranchMenuItem.id per schema
          quantity: itemInput.quantity,
          price: unitPrice,
        };
      });

      // 3. Create the Order and items in a transaction
      const newOrder = await this.prisma.order.create({
        data: {
          totalPrice: calculatedTotal,
          userId: userId,
          branchId: branchId,
          itemCount: calculatedItemCount,
          status,
          CustomerName: CustomerName || user.fullName,
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

  /**
   * Updates an existing order. Only allows updates if the order is still PENDING.
   */
  async updateOrder(orderId: string, data: UpdateOrderDto) {
    try {
      const existingOrder = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!existingOrder)
        throw new RpcException({
          statusCode: 404,
          message: `Order ${orderId} not found`,
        });

      // Business rule: Cannot update orders that are already processed or cancelled
      if (existingOrder.status !== OrderState.PENDING) {
        throw new RpcException({
          statusCode: 400,
          message: `Order cannot be modified because it is already ${existingOrder.status}`,
        });
      }

      const { items, ...updateData } = data;

      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          ...updateData,
          ...(items && {
            items: {
              deleteMany: {}, // Clear old items
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

  /**
   * Deletes an order from the system.
   */
  async deleteOrder(orderId: string) {
    try {
      await this.prisma.order.delete({ where: { id: orderId } });
      this.kafkaClient.emit('order.deleted', { id: orderId });
      return { message: `Order ${orderId} deleted successfully` };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieves paginated orders for a branch with optional status/source filtering.
   */
  async getOrdersByBranch(
    branchId: string,
    page = 1,
    limit = 10,
    status?: OrderState,
    orderSource?: source,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      branchId,
      ...(status && { status }),
      ...(orderSource && { source: orderSource }),
    };

    try {
      return await this.prisma.$transaction(async (tx) => {
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
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieves a single order by ID with item and user details.
   */
  async getOrderById(orderId: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true, user: true },
      });
      if (!order)
        throw new RpcException({ statusCode: 404, message: 'Order not found' });
      return order;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Centralized error handler to map Prisma errors to RpcExceptions.
   */
  private handleError(error: unknown) {
    if (error instanceof RpcException) throw error;

    const err = error as Record<string, unknown>;

    // Prisma error for "Record not found"
    if (err?.code === 'P2025') {
      throw new RpcException({ statusCode: 404, message: 'Record not found' });
    }

    // Prisma error for "Unique constraint failed"
    if (err?.code === 'P2002') {
      throw new RpcException({
        statusCode: 409,
        message: 'Unique constraint failed',
      });
    }

    throw new RpcException({
      statusCode: err?.status || 500,
      message: err?.message || 'Internal Server Error',
    });
  }
}
