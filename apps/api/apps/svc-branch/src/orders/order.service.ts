import { CreateOrderDto, UpdateOrderDto } from '@app/common';
import { PaginationRequestDto } from '@app/common/dtos/PaginationDto/paginated-result.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { Prisma } from 'libs/db/generated/client/client';
import { OrderState } from 'libs/db/generated/client/enums';
import { createPagination } from 'utils/pagination.util';
import { OrderCalculator } from './order.calculator';
import { OrderRepository } from './order.repository';
import { OrderValidator } from './order.validator';

@Injectable()
export class OrderService {
  constructor(
    private readonly repo: OrderRepository,
    private readonly validator: OrderValidator,
    private readonly calculator: OrderCalculator,
    @Inject('BRANCH_SERVICE') private readonly kafka: ClientKafka,
  ) {}

  async createOrder(branchId: string, data: CreateOrderDto, userId: string) {
    try {
      if (!data) {
        throw new RpcException({
          statusCode: 400,
          message: 'Invalid request payload',
        });
      }

      const { items = [], status = OrderState.PENDING, CustomerName } = data;

      this.validator.validateItems(items);
      const { user } = await this.validator.validateBranchAndUser(
        branchId,
        userId,
      );

      const menuItems = await this.repo.getMenuItems(
        branchId,
        items.map((i) => i.menuItemId),
      );

      const { total, itemCount, orderItemsData } = this.calculator.calculate(
        items,
        menuItems,
      );

      const order = await this.repo.create({
        totalPrice: total,
        userId,
        branchId,
        itemCount,
        status,
        CustomerName: CustomerName || user.fullName,
        items: { create: orderItemsData },
      });

      this.kafka.emit('order.created', order);
      return order;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateOrder(orderId: string, data: UpdateOrderDto) {
    try {
      const existing = await this.repo.findById(orderId);

      if (!existing)
        throw new RpcException({ statusCode: 404, message: 'Order not found' });

      if (existing.status !== OrderState.PENDING) {
        throw new RpcException({
          statusCode: 400,
          message: `Order already ${existing.status}`,
        });
      }

      const { items, ...rest } = data;

      const updated = await this.repo.update(orderId, {
        ...rest,
        ...(items && {
          items: {
            deleteMany: {},
            create: items,
          },
        }),
      });

      this.kafka.emit('order.updated', updated);
      return updated;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteOrder(orderId: string) {
    try {
      await this.repo.delete(orderId);
      this.kafka.emit('order.deleted', { id: orderId });
      return { message: 'Deleted successfully' };
    } catch (error) {
      this.handleError(error);
    }
  }

  async getOrdersByBranch(branchId: string, dto: PaginationRequestDto) {
    const { page, limit, status, source } = dto;
    const skip = (page - 1) * limit;

    const where = {
      branchId,
      ...(status && { status }),
      ...(source && { source }),
    };

    try {
      const { total, orders } = await this.repo.getOrdersByBranch(
        where,
        skip,
        limit,
      );

      return createPagination(orders, total, page, limit);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getOrderById(orderId: string) {
    try {
      const order = await this.repo.findById(orderId);
      if (!order)
        throw new RpcException({ statusCode: 404, message: 'Order not found' });
      return order;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getOrderStatuses(branchId: string) {
    try {
      const stats = await this.repo.groupByStatus(branchId);

      const result = stats.reduce(
        (acc, curr) => {
          acc[curr.status] = curr._count.status;
          return acc;
        },
        {} as Record<OrderState, number>,
      );

      Object.values(OrderState).forEach((s) => {
        if (!result[s]) result[s] = 0;
      });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof RpcException) throw error;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new RpcException({
            statusCode: 404,
            message: 'Record not found',
          });

        case 'P2002': {
          const target =
            typeof error.meta === 'object' &&
            error.meta !== null &&
            'target' in error.meta
              ? (error.meta as { target: string | string[] }).target
              : 'unknown';

          const targetString = Array.isArray(target)
            ? target.join(', ')
            : target;

          throw new RpcException({
            statusCode: 409,
            message: `Unique constraint failed on ${targetString}`,
          });
        }
      }
    }

    if (error instanceof Error) {
      throw new RpcException({
        statusCode: 500,
        message: error.message,
      });
    }

    throw new RpcException({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}
