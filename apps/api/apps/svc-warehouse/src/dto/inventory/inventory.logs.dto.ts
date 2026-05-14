// inventory.logs.dto.ts
import {
  PaginatedResponseDto,
  PaginationRequestDto,
} from '@app/common/dtos/PaginationDto/paginated-result.dto';
import { ApiProperty } from '@nestjs/swagger';
import { InventoryUsageLogDto } from './Inventory.base.dto';

export class GetInventoryLogsReqDto extends PaginationRequestDto {
  @ApiProperty({ example: 'uuid-here' })
  warehouseId: string;
}

export class GetInventoryLogsResDto extends PaginatedResponseDto<InventoryUsageLogDto> {}
