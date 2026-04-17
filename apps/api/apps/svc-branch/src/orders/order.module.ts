import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DbModule } from '@app/db';
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

    DbModule,

    ClientsModule.register([
      {
        name: 'BRANCH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9094'],
          },
          consumer: {
            groupId:
              'branch-event-producer-client' +
              Math.random().toString(36).substring(7),
            allowAutoTopicCreation: true,
            sessionTimeout: 6000,
            heartbeatInterval: 2000,
          },
        },
      },
    ]),
  ],

  controllers: [OrderController],

  providers: [OrderService, OrderRepository, OrderValidator, OrderCalculator],
})
export class OrderModule {}
