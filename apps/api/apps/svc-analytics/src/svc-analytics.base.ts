import { PrismaService } from '@app/db';
import { RpcException } from '@nestjs/microservices';
import { LineChartAnalyticsResponseDto } from './AnalyticsDto/line.chart.analytics.dto';

/**
 * Abstract base class for analytics services.
 *
 * Provides shared utility methods commonly used in analytics calculations,
 * such as period calculations, data aggregation, branch validation, and
 * percentage growth computations.
 */
export abstract class SvcAnalyticsBase {
  /**
   * Constructs SvcAnalyticsBase with an injected PrismaService for DB access.
   * @param prisma Instance of PrismaService for DB queries.
   */
  constructor(protected readonly prisma: PrismaService) {}

  /**
   * Validates that a branch with the specified branchID exists in the database.
   * Throws an RpcException if not found.
   *
   * @param branchID The branch ID to check existence for.
   * @throws {RpcException} When the branch does not exist.
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
   * Computes the current and previous analytics periods for stats calculations.
   * Used to segment and compare current/previous intervals.
   *
   * @param days Number of days in the analytics period (e.g. 7 for weekly stats).
   * @returns An object containing:
   *  - currentStart: Date of the start of the current interval
   *  - previousStart: Date of the start of the preceding interval
   *  - now: Date object representing the current time
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

  /**
   * Computes the total expenses from a collection of expense records.
   *
   * Each expense contains the unit cost and the quantity change.
   * If costPerUnit is missing, it defaults to 0.
   * The sign of the quantityChange affects total (negative = spent, positive = refund?).
   *
   * @param expenses Array of expense objects with cost and quantity fields.
   * @returns Cumulative sum of all expenses (number).
   */
  protected CountExpenses(
    expenses: Array<{
      id: string;
      quantityChange: number;
      createdAt: Date;
      costPerUnit: number;
    }>,
  ): number {
    // Sums expenses, each expense = costPerUnit * quantityChange * -1 (for spent)
    // Make sure to return a number, not a string
    const total = expenses.reduce((sum, e) => {
      const costPerUnit = e.costPerUnit ?? 0;
      // The -1 ensures expenses increase positively as quantityChange is usually negative for spending
      return sum + costPerUnit * e.quantityChange;
    }, 0);
    return Number(total.toFixed(0)) * -1;
  }

  /**
   * Aggregates an array of records by day (or unit interval).
   *
   * Combines all values that share the same date (YYYY-MM-DD) and sorts them.
   *
   * @param records Array of { timestamp, value } objects.
   * @returns Array of grouped and summed records by day.
   */
  protected buildRecords(
    records: Array<{ timestamp: string; value: number }>,
  ): Array<{ timestamp: string; value: number }> {
    const grouped = new Map<string, number>();

    for (const record of records) {
      // Extract date in YYYY-MM-DD from timestamp
      const day = new Date(record.timestamp).toISOString().split('T')[0];
      if (day !== undefined) {
        grouped.set(day, (grouped.get(day) ?? 0) + record.value);
      }
    }

    // Return sorted, aggregated records
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, value]) => ({
        timestamp: day,
        value: Number(value.toFixed(0)),
      }));
  }

  /**
   * Quickly converts an array of expense records into the format required for
   * a line chart, grouping expenses by date and summing their values.
   *
   * @param expenses Array of expense records
   * @returns Array of { timestamp, value } grouped by day
   */
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
        value: Number(
          ((e.costPerUnit ?? 0) * Math.abs(e.quantityChange)).toFixed(0),
        ),
      })),
    );
  }

  /**
   * Calculates the percent change from previous value to current value.
   *
   * - Returns 0 if both values are 0.
   * - Returns 100 if previous is 0 and current is nonzero.
   * - Otherwise, computes ((current - previous) / previous) * 100.
   *
   * @param current The current period value.
   * @param previous The previous period value.
   * @returns Percent difference (can be negative, 0, or positive).
   */
  protected calcPercentageChange(current: number, previous: number): number {
    if (previous === 0 && current === 0) return 0;
    if (previous === 0) return 100;
    const percentChange = ((current - previous) / previous) * 100;
    return Number(percentChange.toFixed(2));
  }
}
