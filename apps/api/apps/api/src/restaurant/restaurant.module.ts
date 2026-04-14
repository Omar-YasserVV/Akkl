import { GuardsModule } from '@app/guards';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { RolesGuard } from '@app/guards/role.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { RestaurantController } from './restaurant.controller';

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
        'api-gateway-restaurant-group',
        'api-gateway-restaurant',
      ),
    ]),
  ],
  controllers: [RestaurantController],
  providers: [JwtAuthGuard, RolesGuard],
})
export class RestaurantModule {}
