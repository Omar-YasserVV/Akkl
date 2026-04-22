import { PrismaService } from '@app/db';
import { RpcException } from '@nestjs/microservices';

export abstract class SvcAnalyticsBase {
  constructor(protected readonly prisma: PrismaService) {}

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

  protected calcPercentageChange(current: number, previous: number): number {
    if (previous === 0 && current === 0) return 0;
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  }
}
