import { PrismaService } from '@app/db';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class SvcAnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ANALYTICS_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  totalBranchRevenue(branchID: string) {
    // : LineChartAnalyticsResponseDto

    const branch = this.prisma.branch.findFirst({
      where: {
        id: branchID,
      },
    });
  }
}
