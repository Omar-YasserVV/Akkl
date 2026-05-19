import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { OrderState } from 'libs/db/generated/client/enums';

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueStats(branchId: string, start: Date, end: Date) {
    return this.prisma.order.aggregate({
      where: {
        branchId,
        status: OrderState.COMPLETED,
        createdAt: { gte: start, lte: end },
      },
      _sum: { totalPrice: true },
    });
  }

  async getOrderCount(branchId: string, start: Date, end: Date) {
    return this.prisma.order.count({
      where: {
        branchId,
        status: OrderState.COMPLETED,
        createdAt: { gte: start, lte: end },
      },
    });
  }

  async getOrderTimeline(
    branchId: string,
    start: Date,
    end: Date,
    includePrice = false,
  ) {
    return this.prisma.order.findMany({
      where: {
        branchId,
        status: OrderState.COMPLETED,
        createdAt: { gte: start, lte: end },
      },
      select: {
        createdAt: true,
        totalPrice: includePrice,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getTopSellingByMenuItem(
    branchId: string,
    start: Date,
    end: Date,
    limit: number,
  ) {
    return this.prisma.orderItem.groupBy({
      by: ['menuItemId'],
      where: {
        order: {
          branchId,
          status: OrderState.COMPLETED,
          createdAt: { gte: start, lte: end },
        },
      },
      _sum: {
        quantity: true,
        totalPrice: true,
      },
      orderBy: {
        _sum: {
          totalPrice: 'desc',
        },
      },
      take: Number(limit),
    });
  }

  async getMenuItemsByIds(menuItemIds: string[]) {
    if (menuItemIds.length === 0) return [];
    return this.prisma.branchMenuItem.findMany({
      where: { id: { in: menuItemIds } },
      select: { id: true, name: true },
    });
  }
}
