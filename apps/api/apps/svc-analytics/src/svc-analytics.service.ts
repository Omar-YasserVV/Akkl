import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import {
  LineChartAnalyticsRequestDto,
  LineChartAnalyticsResponseDto,
} from './AnalyticsDto/line.chart.analytics.dto';
import { SvcAnalyticsBase } from './svc-analytics.base';

@Injectable()
export class SvcAnalyticsService extends SvcAnalyticsBase {
  constructor(
    prisma: PrismaService, // Passed to base if needed
    private readonly repo: AnalyticsRepository,
  ) {
    super(prisma);
  }

  async branchRevenue(
    branchID: string,
    dto: LineChartAnalyticsRequestDto,
  ): Promise<LineChartAnalyticsResponseDto> {
    await this.assertBranchExists(branchID);
    const { currentStart, previousStart, now } = this.buildPeriods(
      dto.daysAgo ?? 7,
    );

    const [currentAgg, previousAgg, orders] = await Promise.all([
      this.repo.getRevenueStats(branchID, currentStart, now),
      this.repo.getRevenueStats(branchID, previousStart, currentStart),
      this.repo.getOrderTimeline(branchID, currentStart, now, true),
    ]);

    const currentVal = currentAgg._sum.totalPrice?.toNumber() ?? 0;
    const previousVal = previousAgg._sum.totalPrice?.toNumber() ?? 0;

    return {
      totalCount: currentVal,
      percentageChange: this.calcPercentageChange(currentVal, previousVal),
      records: orders.map((o) => ({
        timestamp: o.createdAt.toISOString(),
        value: o.totalPrice.toNumber(),
      })),
    };
  }

  async branchOrders(
    branchID: string,
    dto: LineChartAnalyticsRequestDto,
  ): Promise<LineChartAnalyticsResponseDto> {
    await this.assertBranchExists(branchID);
    const { currentStart, previousStart, now } = this.buildPeriods(
      dto.daysAgo ?? 7,
    );

    const [currentCount, previousCount, orders] = await Promise.all([
      this.repo.getOrderCount(branchID, currentStart, now),
      this.repo.getOrderCount(branchID, previousStart, currentStart),
      this.repo.getOrderTimeline(branchID, currentStart, now, false),
    ]);

    return {
      totalCount: currentCount,
      percentageChange: this.calcPercentageChange(currentCount, previousCount),
      records: orders.map((o) => ({
        timestamp: o.createdAt.toISOString(),
        value: 1,
      })),
    };
  }
}
