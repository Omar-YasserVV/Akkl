// inventory.alerts.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseInventoryItemDto } from './Inventory.base.dto';

export class GetStockAlertsReqDto {
  @ApiProperty({ example: 'uuid-here' })
  warehouseId: string;
}

export class GetStockAlertsResDto {
  @ApiProperty({ type: () => [BaseInventoryItemDto] })
  items: BaseInventoryItemDto[];
}
