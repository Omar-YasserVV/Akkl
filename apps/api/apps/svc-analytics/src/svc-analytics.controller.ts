import { Controller, Get } from '@nestjs/common';
import { SvcAnalyticsService } from './svc-analytics.service';

@Controller()
export class SvcAnalyticsController {
  constructor(private readonly svcAnalyticsService: SvcAnalyticsService) {}

  @Get()
  getHello(): string {
    return this.svcAnalyticsService.getHello();
  }
}
