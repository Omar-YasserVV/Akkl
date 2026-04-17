// svc-analytics.service.ts
import {
  LineChartAnalyticsRequestDto,
  LineChartAnalyticsResponseDto,
} from '@app/common';
import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { OrderState } from 'libs/db/generated/client/enums';
import { SvcAnalyticsBase } from './svc-analytics.base';

@Injectable()
export class SvcAnalyticsService extends SvcAnalyticsBase {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async BranchRevenue(
    branchID: string,
    dto: LineChartAnalyticsRequestDto,
  ): Promise<LineChartAnalyticsResponseDto> {
    await this.assertBranchExists(branchID);

    const days = dto.daysAgo ?? 7;
    const { currentStart, previousStart, now } = this.buildPeriods(days);

    const [currentAgg, previousAgg, orders] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          branchId: branchID,
          status: OrderState.COMPLETED,
          createdAt: { gte: currentStart, lte: now },
        },
        _sum: { totalPrice: true },
      }),

      this.prisma.order.aggregate({
        where: {
          branchId: branchID,
          status: OrderState.COMPLETED,
          createdAt: { gte: previousStart, lte: currentStart },
        },
        _sum: { totalPrice: true },
      }),

      this.prisma.order.findMany({
        where: {
          branchId: branchID,
          status: OrderState.COMPLETED,
          createdAt: { gte: currentStart, lte: now },
        },
        select: { createdAt: true, totalPrice: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const currentValue = currentAgg._sum.totalPrice?.toNumber() ?? 0;
    const previousValue = previousAgg._sum.totalPrice?.toNumber() ?? 0;

    return {
      totalCount: currentValue,
      percentageChange: this.calcPercentageChange(currentValue, previousValue),
      records: orders.map((order) => ({
        timestamp: order.createdAt.toISOString(),
        value: order.totalPrice.toNumber(),
      })),
    };
  }

  async BranchOrders(
    branchID: string,
    dto: LineChartAnalyticsRequestDto,
  ): Promise<LineChartAnalyticsResponseDto> {
    await this.assertBranchExists(branchID);

    const days = dto.daysAgo ?? 7;
    const { currentStart, previousStart, now } = this.buildPeriods(days);

    const [currentCount, previousCount, orders] = await Promise.all([
      this.prisma.order.count({
        where: {
          branchId: branchID,
          status: OrderState.COMPLETED,
          createdAt: { gte: currentStart, lte: now },
        },
      }),
      this.prisma.order.count({
        where: {
          branchId: branchID,
          status: OrderState.COMPLETED,
          createdAt: { gte: previousStart, lte: currentStart },
        },
      }),
      this.prisma.order.findMany({
        where: {
          branchId: branchID,
          status: OrderState.COMPLETED,
          createdAt: { gte: currentStart, lte: now },
        },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    return {
      totalCount: currentCount,
      percentageChange: this.calcPercentageChange(currentCount, previousCount),
      records: orders.map((order) => ({
        timestamp: order.createdAt.toISOString(),
        value: 1,
      })),
    };
  }
}
