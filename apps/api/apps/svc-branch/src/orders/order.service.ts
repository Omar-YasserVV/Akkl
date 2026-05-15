import { CreateOrderDto, UpdateOrderDto, WAREHOUSE_TOPICS } from '@app/common';
import { ListOrdersReqDto } from '@app/common/dtos/OrderDto/list.order.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'; // 👈 added OnModuleInit
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { Prisma } from 'libs/db/generated/client/client';
import { OrderState } from 'libs/db/generated/client/enums';
import { firstValueFrom } from 'rxjs';
import { createPagination } from 'utils/pagination.util';
import { OrderCalculator } from './order.calculator';
import { OrderRepository } from './order.repository';
import { OrderValidator } from './order.validator';

@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    private readonly repo: OrderRepository,
    private readonly validator: OrderValidator,
    private readonly calculator: OrderCalculator,
    @Inject('BRANCH_SERVICE') private readonly kafka: ClientKafka,
    @Inject('WAREHOUSE_SERVICE') private readonly warehouseKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.warehouseKafka.subscribeToResponseOf(
      WAREHOUSE_TOPICS.DEDUCT_FOR_ORDER,
    );
    await this.warehouseKafka.connect();
  }

  async createOrder(branchId: string, data: CreateOrderDto, userId: string) {
    try {
      if (!data) {
        throw new RpcException({
          statusCode: 400,
          message: 'Invalid request payload',
        });
      }

      const { items = [], CustomerName } = data;

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

      const deductionResult = await firstValueFrom(
        this.warehouseKafka.send(WAREHOUSE_TOPICS.DEDUCT_FOR_ORDER, {
          branchId,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })),
        }),
      );

      if (!deductionResult.success) {
        throw new RpcException({
          statusCode: 422,
          message: deductionResult.message ?? 'Inventory deduction failed',
        });
      }

      const order = await this.repo.create({
        totalPrice: total,
        userId,
        branchId,
        itemCount,
        status: OrderState.IN_PROGRESS,
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

      if (existing.status === data.status) {
        throw new RpcException({
          statusCode: 400,
          message: `Order already ${existing.status}`,
        });
      }

      const { items, ...rest } = data;
      let updatePayload: Prisma.OrderUpdateInput = { ...rest };

      // If items are being updated, we must recalculate prices and totals
      if (items && items.length > 0) {
        this.validator.validateItems(items);

        // 1. Get menu items to get their current prices
        const menuItems = await this.repo.getMenuItems(
          existing.branchId,
          items.map((i) => i.menuItemId),
        );

        // 2. Use your calculator to get the price and formatted data
        const { total, itemCount, orderItemsData } = this.calculator.calculate(
          items,
          menuItems,
        );

        // 3. Update the payload with new totals and the correct item structure
        updatePayload = {
          ...updatePayload,
          totalPrice: total,
          itemCount: itemCount,
          items: {
            deleteMany: {},
            create: orderItemsData, // This now includes the 'price' field!
          },
        };
      }

      const updated = await this.repo.update(orderId, updatePayload);

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

  async getOrdersByBranch(dto: ListOrdersReqDto) {
    const {
      pagination: { limit, page, source, status },
      branchId,
    } = dto;
    const skip = (page - 1) * limit;

    const where: any = {
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
      return {
        ...order,
        user: order.user
          ? {
              id: order.user.id,
              fullName: order.user.fullName,
              email: order.user.email,
            }
          : null,
      };
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
