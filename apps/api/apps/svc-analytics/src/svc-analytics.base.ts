import { PrismaService } from '@app/db';
import { RpcException } from '@nestjs/microservices';
import { LineChartAnalyticsResponseDto } from './AnalyticsDto/line.chart.analytics.dto';

/**
 * Abstract base class for analytics services, providing shared utilities
 * for analytics calculations and branch validation.
 */
export abstract class SvcAnalyticsBase {
  /**
   * Constructs the SvcAnalyticsBase.
   * @param prisma PrismaService instance for database operations.
   */
  constructor(protected readonly prisma: PrismaService) {}

  /**
   * Ensures that the branch with the provided branchID exists.
   * Throws an RpcException if the branch does not exist.
   *
   * @param branchID - The ID of the branch to validate.
   * @throws RpcException if the branch doesn't exist.
   */
  protected async assertBranchExists(branchID: string): Promise<void> {
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchID },
    });
    if (!branch) {
      throw new RpcException({
        message: "This branch doesn't exist",
        status: 404,
      });
    }
  }

  /**
   * Calculates analytics periods given the number of days:
   * - currentStart: start of the current period
   * - previousStart: start of the previous (preceding) period
   * - now: the current timestamp
   *
   * @param days - Number of days for the "current" period.
   * @returns An object with currentStart, previousStart, and now as Date objects.
   */
  protected buildPeriods(days: number): {
    currentStart: Date;
    previousStart: Date;
    now: Date;
  } {
    const now = new Date();
    const currentStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const previousStart = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000);
    return { currentStart, previousStart, now };
  }

  protected CountExpenses(
    expenses: Array<{
      id: string;
      quantityChange: number;
      createdAt: Date;
      costPerUnit: number;
    }>,
  ) {
    return expenses.reduce((sum, e) => {
      // get costPerUnit from first batch if exists, else 0
      const costPerUnit = e.costPerUnit ?? 0;

      return sum + costPerUnit * e.quantityChange;
    }, 0);
  }
  protected buildRecords(
    records: Array<{ timestamp: string; value: number }>,
  ): Array<{ timestamp: string; value: number }> {
    const grouped = new Map<string, number>();

    for (const record of records) {
      const day = new Date(record.timestamp).toISOString().split('T')[0];
      if (day !== undefined) {
        grouped.set(day, (grouped.get(day) ?? 0) + record.value);
      }
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, value]) => ({
        timestamp: day,
        value,
      }));
  }

  protected buildExpensesRecords(
    expenses: Array<{
      id: string;
      quantityChange: number;
      createdAt: Date;
      costPerUnit: number;
    }>,
  ): LineChartAnalyticsResponseDto['records'] {
    return this.buildRecords(
      expenses.map((e) => ({
        timestamp: e.createdAt.toISOString(),
        value: (e.costPerUnit ?? 0) * Math.abs(e.quantityChange),
      })),
    );
  }

  /**
   * Calculates the percentage change between two numbers.
   * Handles edge cases where previous is zero.
   *
   * @param current - The current value.
   * @param previous - The previous value.
   * @returns The percentage change from previous to current.
   *          If both current and previous are 0, returns 0.
   *          If previous is 0 and current is nonzero, returns 100.
   */
  protected calcPercentageChange(current: number, previous: number): number {
    if (previous === 0 && current === 0) return 0;
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  }
}
