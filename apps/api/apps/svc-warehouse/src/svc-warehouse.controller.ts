import { Controller, Get } from '@nestjs/common';
import { SvcWarehouseService } from './svc-warehouse.service';

@Controller()
export class SvcWarehouseController {
  constructor(private readonly svcWarehouseService: SvcWarehouseService) {}

  @Get()
  getHello(): string {
    return this.svcWarehouseService.getHello();
  }
}
