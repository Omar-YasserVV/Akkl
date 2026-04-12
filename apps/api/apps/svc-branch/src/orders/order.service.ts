import { CreateOrderDto, UpdateOrderDto } from '@app/common';
import { PrismaService } from '@app/db';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('BRANCH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}
  async createOrder(branchId: number, data: CreateOrderDto) {
    const [branch, user] = await Promise.all([
      this.prisma.branch.findUnique({ where: { id: Number(branchId) } }),
      this.prisma.user.findUnique({ where: { id: Number(data.userId) } }),
    ]);

    if (!branch) throw new NotFoundException(`Branch ${branchId} not found`);
    if (!user) throw new NotFoundException(`User ${data.userId} not found`);

    const menuItems = await this.prisma.branchMenuItem.findMany({
      where: {
        id: { in: data.items.map((i) => i.menuItemId) },
        branchId: Number(branchId),
      },
      include: { variations: true },
    });

    let calculatedTotal = 0;
    let calculatedItemCount = 0;

    const orderItemsData = data.items.map((itemInput) => {
      const dbItem = menuItems.find((m) => m.id === itemInput.menuItemId);

      if (!dbItem) {
        throw new BadRequestException(
          `Item ${itemInput.menuItemId} is not available at this branch.`,
        );
      }

      // Use the first variation price as the base price
      const unitPrice = Number(dbItem.variations[0]?.price || 0);

      calculatedTotal += unitPrice * itemInput.quantity;
      calculatedItemCount += itemInput.quantity;

      return {
        menuItemId: itemInput.menuItemId,
        quantity: itemInput.quantity,
        price: unitPrice, // Save the actual price at the time of purchase
      };
    });

    // 4. Create the Order in the database
    const newOrder = await this.prisma.order.create({
      data: {
        totalPrice: calculatedTotal,
        userId: Number(data.userId),
        branchId: Number(branchId),
        itemCount: calculatedItemCount,
        status: data.status || 'PENDING',
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
