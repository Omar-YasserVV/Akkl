import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.registerAsync([
      createKafkaClient(
        'ANALYTICS_SERVICE',
        'api-gateway-analytics-group',
        'api-gateway-analytics',
      ),
    ]),
  ],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
