// inventory.list.dto.ts

import {
  PaginatedResponseDto,
  PaginationRequestDto,
} from '@app/common/dtos/PaginationDto/paginated-result.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StockStatus } from 'libs/db/generated/client/enums';
import { BaseInventoryItemDto } from './Inventory.base.dto';

export class ListInventoryItemsReqDto extends PaginationRequestDto {
  @ApiPropertyOptional({ example: 'uuid-here' })
  warehouseId: string;

  @ApiPropertyOptional({ enum: StockStatus, example: StockStatus.LOW_STOCK })
  stockStatus?: StockStatus;
}

export class ListInventoryItemsResDto extends PaginatedResponseDto<BaseInventoryItemDto> {}
