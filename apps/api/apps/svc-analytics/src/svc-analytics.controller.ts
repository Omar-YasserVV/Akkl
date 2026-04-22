import { ANALYTICS_TOPICS } from '@app/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  LineChartAnalyticsRequestDto,
  LineChartAnalyticsResponseDto,
} from './AnalyticsDto/line.chart.analytics.dto';
import { SvcAnalyticsService } from './svc-analytics.service';

@Controller()
export class SvcAnalyticsController {
  constructor(private readonly svcAnalyticsService: SvcAnalyticsService) {}

  @MessagePattern(ANALYTICS_TOPICS.BRANCH_REVENUE)
  async branchRevenue(
    @Payload() payload: { branchID: string; dto: LineChartAnalyticsRequestDto },
  ): Promise<LineChartAnalyticsResponseDto> {
    return this.svcAnalyticsService.branchRevenue(
      payload.branchID,
      payload.dto,
    );
  }

  @MessagePattern(ANALYTICS_TOPICS.BRANCH_ORDERS)
  async branchOrders(
    @Payload() payload: { branchID: string; dto: LineChartAnalyticsRequestDto },
  ): Promise<LineChartAnalyticsResponseDto> {
    return this.svcAnalyticsService.branchOrders(payload.branchID, payload.dto);
  }
}
