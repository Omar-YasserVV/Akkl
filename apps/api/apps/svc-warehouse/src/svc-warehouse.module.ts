import { Module } from '@nestjs/common';
import { SvcWarehouseController } from './svc-warehouse.controller';
import { SvcWarehouseService } from './svc-warehouse.service';

@Module({
  imports: [],
  controllers: [SvcWarehouseController],
  providers: [SvcWarehouseService],
})
export class SvcWarehouseModule {}
