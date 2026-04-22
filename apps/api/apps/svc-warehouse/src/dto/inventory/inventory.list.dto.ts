// inventory.list.dto.ts

import {
  PaginatedResponseDto,
  PaginationRequestDto,
} from '@app/common/dtos/PaginationDto/paginated-result.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { stockStatus } from 'libs/db/generated/client/enums';
import { BaseInventoryItemDto } from './Inventory.base.dto';

export class ListInventoryItemsReqDto extends PaginationRequestDto {
  @ApiPropertyOptional({ example: 'uuid-here' })
  warehouseId: string;

  @ApiPropertyOptional({ enum: stockStatus, example: stockStatus.LOW_STOCK })
  stockStatus?: stockStatus;
}

export class ListInventoryItemsResDto extends PaginatedResponseDto<BaseInventoryItemDto> {}
