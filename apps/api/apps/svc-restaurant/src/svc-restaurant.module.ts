import { DbModule } from '@app/db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { SvcRestaurantController } from './svc-restaurant.controller';
import { SvcRestaurantService } from './svc-restaurant.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),

    ClientsModule.registerAsync([
      createKafkaClient(
        'RESTAURANT_SERVICE',
        'svc-restaurant-server-group',
        'svc-restaurant',
      ),
    ]),
    DbModule,
  ],
  controllers: [SvcRestaurantController],
  providers: [SvcRestaurantService],
})
export class SvcRestaurantModule {}
