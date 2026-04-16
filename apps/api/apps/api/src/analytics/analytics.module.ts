import { GuardsModule } from '@app/guards/guards.module';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { RolesGuard } from '@app/guards/role.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [
    GuardsModule,
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
  providers: [JwtAuthGuard, RolesGuard],
})
export class AnalyticsModule {}
