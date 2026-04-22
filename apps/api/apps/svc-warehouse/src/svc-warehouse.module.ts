import { DbModule } from '@app/db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { SvcWarehouseController } from './svc-warehouse.controller';
import { SvcWarehouseService } from './svc-warehouse.service';
import { WarehouseRepository } from './warehouse.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    ClientsModule.registerAsync([
      createKafkaClient(
        'WAREHOUSE_SERVICE',
        'svc-warehouse-server-group',
        'svc-warehouse',
      ),
    ]),
    DbModule,
  ],

  controllers: [SvcWarehouseController],
  providers: [SvcWarehouseService, WarehouseRepository],
})
export class SvcWarehouseModule {}
