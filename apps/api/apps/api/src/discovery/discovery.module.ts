import { GuardsModule } from '@app/guards';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { RolesGuard } from '@app/guards/role.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { DiscoveryController } from './discovery.controller';

@Module({
  imports: [
    GuardsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.registerAsync([
      createKafkaClient(
        'RESTAURANT_SERVICE',
        'api-gateway-discovery-restaurant-group',
        'api-gateway-discovery-restaurant',
      ),
      createKafkaClient(
        'BRANCH_SERVICE',
        'api-gateway-discovery-branch-group',
        'api-gateway-discovery-branch',
      ),
    ]),
  ],
  controllers: [DiscoveryController],
  providers: [JwtAuthGuard, RolesGuard],
})
export class DiscoveryModule {}
