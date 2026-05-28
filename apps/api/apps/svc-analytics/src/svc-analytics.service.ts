import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import {
  LineChartAnalyticsRequestDto,
  LineChartAnalyticsResponseDto,
} from './AnalyticsDto/line.chart.analytics.dto';
import {
  TopSellingAnalyticsRequestDto,
  TopSellingAnalyticsResponseDto,
} from './AnalyticsDto/top-selling.analytics.dto';
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
      records: this.buildRecords(
        orders.map((order) => ({
          timestamp: order.createdAt.toISOString(),
          value: Number(order.totalPrice),
        })),
      ),
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
      records: this.buildRecords(
        orders.map((o) => ({
          timestamp: o.createdAt.toISOString(),
          value: 1,
        })),
      ),
    };
  }

  async branchTopSelling(
    branchID: string,
    dto: TopSellingAnalyticsRequestDto,
  ): Promise<TopSellingAnalyticsResponseDto> {
    await this.assertBranchExists(branchID);
    const days = dto.daysAgo ?? 7;
    const topN = dto.topN ?? 5;
    const { currentStart, now } = this.buildPeriods(days);

    const grouped = await this.repo.getTopSellingByMenuItem(
      branchID,
      currentStart,
      now,
      topN,
    );

    if (grouped.length === 0) {
      return { totalCount: 0, items: [] };
    }

    const menuItems = await this.repo.getMenuItemsByIds(
      grouped.map((row) => row.menuItemId),
    );
    const nameById = new Map(menuItems.map((item) => [item.id, item.name]));

    const totalRevenue = grouped.reduce(
      (sum, row) => sum + (row._sum?.totalPrice?.toNumber() ?? 0),
      0,
    );
    const totalSold = grouped.reduce(
      (sum, row) => sum + (row._sum?.quantity ?? 0),
      0,
    );

    const items = grouped.map((row) => {
      const revenue = row._sum?.totalPrice?.toNumber() ?? 0;
      const sold = row._sum?.quantity ?? 0;
      return {
        menuItemId: row.menuItemId,
        name: nameById.get(row.menuItemId) ?? 'Unknown item',
        sold,
        price: revenue,
        revenuePercentage:
          totalRevenue > 0
            ? Math.round((revenue / totalRevenue) * 1000) / 10
            : 0,
      };
    });

    return { totalCount: totalSold, items };
  }

  async branchExpenses(
    branchID: string,
    dto: LineChartAnalyticsRequestDto,
  ): Promise<LineChartAnalyticsResponseDto> {
    await this.assertBranchExists(branchID);
    const days = dto.daysAgo ?? 7;

    const { currentStart, now, previousStart } = this.buildPeriods(days);

    // Due to type mismatch issues, we need to coerce costPerUnit values from Decimal | null to number
    const prevExpensesRaw = await this.repo.getInventoryExpenses(
      branchID,
      previousStart,
      currentStart,
    );
    const prevExpenses = this.CountExpenses(
      prevExpensesRaw.map((expense) => ({
        id: expense.id,
        quantityChange: expense.quantityChange,
        createdAt: expense.createdAt,
        costPerUnit: expense.costPerUnit ? Number(expense.costPerUnit) : 0,
      })),
    );

    const currExpensesRaw = await this.repo.getInventoryExpenses(
      branchID,
      currentStart,
      now,
    );
    const currExpenses = this.CountExpenses(
      currExpensesRaw.map((expense) => ({
        id: expense.id,
        quantityChange: expense.quantityChange,
        createdAt: expense.createdAt,
        costPerUnit: expense.costPerUnit ? Number(expense.costPerUnit) : 0,
      })),
    );

    return {
      percentageChange: this.calcPercentageChange(currExpenses, prevExpenses),
      records: this.buildExpensesRecords(
        currExpensesRaw.map((expense) => ({
          id: expense.id,
          quantityChange: expense.quantityChange,
          createdAt: expense.createdAt,
          costPerUnit: expense.costPerUnit ? Number(expense.costPerUnit) : 0,
        })),
      ),
      totalCount: currExpenses,
    };
  }
}
