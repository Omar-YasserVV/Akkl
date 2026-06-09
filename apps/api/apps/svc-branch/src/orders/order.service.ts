import { CreateOrderDto, UpdateOrderDto, WAREHOUSE_TOPICS } from '@app/common';
import { ListOrdersReqDto } from '@app/common/dtos/OrderDto/list.order.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { DeductForOrderReqDto } from 'apps/svc-warehouse/src/dto/inventory/inventory.deduct.dto';
import { Prisma } from 'libs/db/generated/client/client';
import { OrderState } from 'libs/db/generated/client/enums';
import { firstValueFrom } from 'rxjs';
import { createPagination } from 'utils/pagination.util';
import { OrderCalculator } from './order.calculator';
import { OrderRepository } from './order.repository';
import { OrderValidator } from './order.validator';

/**
 * Service for handling Orders business logic.
 *
 * Coordinates with warehouse (inventory) service via Kafka for inventory deduction,
 * handles CRUD operations for Orders, recalculates order totals, and performs
 * input validation and error handling.
 */
@Injectable()
export class OrderService implements OnModuleInit {
  /**
   * Constructor for dependency injection of repositories, services, and Kafka clients.
   */
  constructor(
    private readonly repo: OrderRepository,
    private readonly validator: OrderValidator,
    private readonly calculator: OrderCalculator,
    @Inject('BRANCH_SERVICE') private readonly kafka: ClientKafka,
    @Inject('WAREHOUSE_SERVICE') private readonly warehouseKafka: ClientKafka,
  ) {}

  /**
   * Subscribes to inventory deduction responses on module init.
   */
  async onModuleInit() {
    this.warehouseKafka.subscribeToResponseOf(
      WAREHOUSE_TOPICS.DEDUCT_FOR_ORDER,
    );
    await this.warehouseKafka.connect();
  }

  /**
   * Creates a new order after validating inputs, deducting inventory, and calculating totals.
   * Emits `order.created` to the BRANCH_SERVICE Kafka topic.
   *
   * @param branchId - The branch where the order is placed
   * @param data - Order creation DTO
   * @param userId - The user placing the order
   * @returns The created order
   */
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

      /**
       * Creates the order in the database via repository.
       */
      const order = await this.repo.create({
        totalPrice: total,
        userId,
        branchId,
        itemCount,
        status: OrderState.IN_PROGRESS,
        customerName: CustomerName || user.fullName,
        items: { create: orderItemsData },
      });
      console.log(order.id);

      /**
       * Deduct inventory for ordered items by sending a message to the warehouse service.
       * Fails if deductionResult is not successful.
       */
      const deductionResult = await firstValueFrom(
        this.warehouseKafka.send(WAREHOUSE_TOPICS.DEDUCT_FOR_ORDER, {
          branchId,
          orderId: order.id,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })),
        } as DeductForOrderReqDto),
      );

      if (!deductionResult.success) {
        throw new RpcException({
          statusCode: 422,
          message: deductionResult.message ?? 'Inventory deduction failed',
        });
      }

      // Emit event to notify other services of the creation
      this.kafka.emit('order.created', order);
      return order;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Updates an order, recalculating all costs if items have changed.
   * Emits `order.updated` to the BRANCH_SERVICE Kafka topic.
   *
   * @param orderId - The ID of the order to update
   * @param data - DTO for updating the order
   * @returns The updated order object
   */
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

        // Get latest menu items information for pricing
        const menuItems = await this.repo.getMenuItems(
          existing.branchId,
          items.map((i) => i.menuItemId),
        );

        // Calculate new totals and structure for order items
        const { total, itemCount, orderItemsData } = this.calculator.calculate(
          items,
          menuItems,
        );

        // Update payload with recalculated totals and items
        updatePayload = {
          ...updatePayload,
          totalPrice: total,
          itemCount: itemCount,
          items: {
            deleteMany: {},
            create: orderItemsData, // Includes price field
          },
        };
      }

      const updated = await this.repo.update(orderId, updatePayload);

      // Emit event indicating order was updated
      this.kafka.emit('order.updated', updated);
      return updated;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Deletes an order by ID.
   * Emits `order.deleted` to the BRANCH_SERVICE Kafka topic.
   *
   * @param orderId - Order identifier
   * @returns Object with success message
   */
  async deleteOrder(orderId: string) {
    try {
      await this.repo.delete(orderId);
      this.kafka.emit('order.deleted', { id: orderId });
      return { message: 'Deleted successfully' };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieves a paginated list of orders for a branch, filtered by status/source if provided.
   *
   * @param dto - Filtering and pagination options
   * @returns Paginated result of orders
   */
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

  /**
   * Retrieves an order by its ID. If a user is attached, only essential fields are returned in the user object.
   *
   * @param orderId - The primary key of the order
   * @returns Order object with user info (if any)
   */
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

  /**
   * Returns a count of orders per possible order status for a branch.
   *
   * @param branchId - Identifier for the branch
   * @returns Record mapping each OrderState to a number (count)
   */
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

  /**
   * Handles and throws formatted exceptions for known Prisma/RPC errors or generic errors.
   *
   * @param error - Error object thrown by an operation
   * @throws RpcException - with proper status code and details
   */
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
