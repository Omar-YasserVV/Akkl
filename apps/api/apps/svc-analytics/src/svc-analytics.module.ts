import { Module } from '@nestjs/common';
import { SvcAnalyticsController } from './svc-analytics.controller';
import { SvcAnalyticsService } from './svc-analytics.service';

@Module({
  imports: [],
  controllers: [SvcAnalyticsController],
  providers: [SvcAnalyticsService],
})
export class SvcAnalyticsModule {}
