import { ANALYTICS_TOPICS } from '@app/common';
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
import {
  LineChartAnalyticsRequestDto,
  LineChartAnalyticsResponseDto,
} from 'apps/svc-analytics/src/AnalyticsDto/line.chart.analytics.dto';
import {
  TopSellingAnalyticsRequestDto,
  TopSellingAnalyticsResponseDto,
} from 'apps/svc-analytics/src/AnalyticsDto/top-selling.analytics.dto';
import { lastValueFrom } from 'rxjs';

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
  async branchRevenue(
    @Query() dto: LineChartAnalyticsRequestDto,
    @GetBranchId() branchID: string,
  ): Promise<LineChartAnalyticsResponseDto> {
    return lastValueFrom(
      this.analyticsClient.send(ANALYTICS_TOPICS.BRANCH_REVENUE, {
        branchID,
        dto,
      }),
    );
  }

  @Get('branch/orders-analytics')
  async branchOrders(
    @Query() dto: LineChartAnalyticsRequestDto,
    @GetBranchId() branchID: string,
  ): Promise<LineChartAnalyticsResponseDto> {
    return lastValueFrom(
      this.analyticsClient.send(ANALYTICS_TOPICS.BRANCH_ORDERS, {
        branchID,
        dto,
      }),
    );
  }

  @Get('branch/top-selling')
  async branchTopSelling(
    @Query() dto: TopSellingAnalyticsRequestDto,
    @GetBranchId() branchID: string,
  ): Promise<TopSellingAnalyticsResponseDto> {
    return lastValueFrom(
      this.analyticsClient.send(ANALYTICS_TOPICS.BRANCH_TOP_SELLING, {
        branchID,
        dto,
      }),
    );
  }

  @Get('branch/expenses')
  async branchExpenses(
    @Query() dto: LineChartAnalyticsRequestDto,
    @GetBranchId() branchID: string,
  ): Promise<any> {
    return lastValueFrom(
      this.analyticsClient.send(ANALYTICS_TOPICS.BRANCH_EXPENSES, {
        branchID,
        dto,
      }),
    );
  }
}
