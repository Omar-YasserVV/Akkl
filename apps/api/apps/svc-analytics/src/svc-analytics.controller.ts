import { ANALYTICS_TOPICS, LineChartAnalyticsRequestDto } from '@app/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SvcAnalyticsService } from './svc-analytics.service';

@Controller()
export class SvcAnalyticsController {
  constructor(private readonly svcAnalyticsService: SvcAnalyticsService) {}

  @MessagePattern(ANALYTICS_TOPICS.BRANCH_REVENUE)
  async BranchRevenue(
    @Payload() payload: { branchID: string; dto: LineChartAnalyticsRequestDto },
  ): Promise<unknown> {
    return this.svcAnalyticsService.BranchRevenue(
      payload.branchID,
      payload.dto,
    );
  }

  @MessagePattern(ANALYTICS_TOPICS.BRANCH_ORDERS)
  async BranchOrders(
    @Payload() payload: { branchID: string; dto: LineChartAnalyticsRequestDto },
  ): Promise<unknown> {
    return this.svcAnalyticsService.BranchOrders(payload.branchID, payload.dto);
  }
}
