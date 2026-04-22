import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

import { createKafkaClient } from 'utils/kafka-client.factory';
import { OrderCalculator } from './order.calculator';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { OrderValidator } from './order.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    ClientsModule.registerAsync([
      createKafkaClient(
        'BRANCH_SERVICE',
        'svc-branch-server-group',
        'svc-branch',
      ),
    ]),
  ],

  controllers: [OrderController],

  providers: [OrderService, OrderRepository, OrderValidator, OrderCalculator],
})
export class OrderModule {}
