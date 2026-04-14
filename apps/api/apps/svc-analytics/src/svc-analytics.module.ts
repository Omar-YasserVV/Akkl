import { DbModule } from '@app/db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SvcAnalyticsController } from './svc-analytics.controller';
import { SvcAnalyticsService } from './svc-analytics.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    DbModule,
  ],
  controllers: [SvcAnalyticsController],
  providers: [SvcAnalyticsService],
})
export class SvcAnalyticsModule {}
