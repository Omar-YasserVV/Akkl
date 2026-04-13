import { CreateOrderDto, UpdateOrderDto } from '@app/common';
import { PrismaService } from '@app/db';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('BRANCH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async createOrder(branchId: number, data: CreateOrderDto) {
    // 1. Destructure with defaults to prevent "undefined" errors
    if (!data) {
      throw new RpcException('Invalid request payload');
    }

    const { items = [], userId, status = 'PENDING' } = data;
    const bId = Number(branchId);
    const uId = Number(userId);

    // 2. Initial Guard: Ensure items exist and are valid
    if (!items || items.length === 0) {
      throw new RpcException('Order must contain at least one item.');
    }

    if (isNaN(bId) || isNaN(uId)) {
      throw new RpcException('Invalid Branch ID or User ID');
    }

    try {
      // 3. Parallel check for Branch and User existence
      const [branch, user] = await Promise.all([
        this.prisma.branch.findUnique({ where: { id: bId } }),
        this.prisma.user.findUnique({ where: { id: uId } }),
      ]);

      if (!branch) throw new RpcException(`Branch ${bId} not found`);
      if (!user) throw new RpcException(`User ${uId} not found`);

      // 4. Fetch Branch Menu Items and their Variations
      const menuItems = await this.prisma.branchMenuItem.findMany({
        where: {
          id: { in: items.map((i) => i.menuItemId) },
          branchId: bId,
        },
        include: { variations: true },
      });

      let calculatedTotal = 0;
      let calculatedItemCount = 0;

      // 5. Map Order Items and calculate pricing
      const orderItemsData = items.map((itemInput) => {
        const dbItem = menuItems.find((m) => m.id === itemInput.menuItemId);

        if (!dbItem) {
          throw new RpcException(
            `Item ${itemInput.menuItemId} is not available at this branch.`,
          );
        }

        // Safety: Prevent crash if a menu item has no variations/prices
        if (!dbItem.variations || dbItem.variations.length === 0) {
          throw new RpcException(
            `Item "${dbItem.name}" has no pricing defined.`,
          );
        }

        // Using the first variation as the default price
        const unitPrice = Number(dbItem.variations[0].price || 0);

        calculatedTotal += unitPrice * itemInput.quantity;
        calculatedItemCount += itemInput.quantity;

        return {
          menuItemId: itemInput.menuItemId,
          quantity: itemInput.quantity,
          price: unitPrice,
        };
      });

      // 6. Create the Order within a transaction or single call
      const newOrder = await this.prisma.order.create({
        data: {
          totalPrice: calculatedTotal,
          userId: uId,
          branchId: bId,
          itemCount: calculatedItemCount,
          status: status,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // 7. Emit to Kafka
      this.kafkaClient.emit('order.created', newOrder);

      return newOrder;
    } catch (error) {
      // Catching any unexpected errors and ensuring they stay as RpcExceptions
      if (error instanceof RpcException) throw error;

      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      throw new RpcException(message);
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
