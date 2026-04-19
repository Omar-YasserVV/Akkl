// inventory.update.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { stockStatus } from 'libs/db/generated/client/enums';
import { BaseInventoryItemDto } from './inventory.base.dto';

export class UpdateInventoryItemReqDto {
  @ApiPropertyOptional({ example: 75 })
  quantity?: number;

  @ApiPropertyOptional({ example: 15 })
  minimumQuantity?: number;

  @ApiPropertyOptional({ enum: stockStatus, example: stockStatus.LOW_STOCK })
  stockStatus?: stockStatus;
}

export class UpdateInventoryItemResDto extends BaseInventoryItemDto {}
