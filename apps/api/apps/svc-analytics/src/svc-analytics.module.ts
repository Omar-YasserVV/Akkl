import { DbModule } from '@app/db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { AnalyticsRepository } from './analytics.repository';
import { SvcAnalyticsController } from './svc-analytics.controller';
import { SvcAnalyticsService } from './svc-analytics.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    ClientsModule.registerAsync([
      createKafkaClient(
        'ANALYTICS_SERVICE',
        'svc-analytics-server-group',
        'svc-analytics',
      ),
    ]),
    DbModule,
  ],

  controllers: [SvcAnalyticsController],
  providers: [SvcAnalyticsService, AnalyticsRepository],
})
export class SvcAnalyticsModule {}
