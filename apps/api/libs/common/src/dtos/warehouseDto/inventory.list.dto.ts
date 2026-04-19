// inventory.list.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { stockStatus } from 'libs/db/generated/client/enums';
import { BaseInventoryItemDto } from './inventory.base.dto';

export class ListInventoryItemsReqDto {
  @ApiProperty({ example: 'uuid-here' })
  warehouseId: string;

  @ApiPropertyOptional({ enum: stockStatus, example: stockStatus.LOW_STOCK })
  stockStatus?: stockStatus;

  @ApiPropertyOptional({ example: 1, default: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  limit?: number;
}

export class ListInventoryItemsResDto {
  @ApiProperty({ type: () => [BaseInventoryItemDto] })
  items: BaseInventoryItemDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}
