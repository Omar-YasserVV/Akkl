import { ANALYTICS_TOPICS, LineChartAnalyticsRequestDto } from '@app/common';
import { GetBranchId } from '@app/guards/branch-id.decorator';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { RolesGuard } from '@app/guards/role.guard';
import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController implements OnModuleInit {
  constructor(
    @Inject('ANALYTICS_SERVICE') private readonly analyticsClient: ClientKafka,
  ) {}

  async onModuleInit() {
    Object.values(ANALYTICS_TOPICS).forEach((topic) => {
      this.analyticsClient.subscribeToResponseOf(topic);
    });

    await this.analyticsClient.connect();
  }

  @Get('branch/revenue-analytics')
  async BranchRevenue(
    @Query() dto: LineChartAnalyticsRequestDto,
    @GetBranchId() branchID: string,
  ) {
    return this.analyticsClient.send(ANALYTICS_TOPICS.BRANCH_REVENUE, {
      branchID,
      dto,
    });
  }

  @Get('branch/orders-analytics')
  async BranchOrders(
    @Query() dto: LineChartAnalyticsRequestDto,
    @GetBranchId() branchID: string,
  ) {
    return this.analyticsClient.send(ANALYTICS_TOPICS.BRANCH_ORDERS, {
      branchID,
      dto,
    });
  }
}
