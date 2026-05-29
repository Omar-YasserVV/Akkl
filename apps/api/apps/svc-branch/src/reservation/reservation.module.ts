import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

import { PrismaService } from '@app/db';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TableController } from './table.controller';

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
  controllers: [ReservationController, TableController],
  providers: [ReservationService, PrismaService],
  exports: [ReservationService],
})
export class ReservationModule {}