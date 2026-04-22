import {
  PaginatedResponseDto,
  PaginationRequestDto,
} from '@app/common/dtos/PaginationDto/paginated-result.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderState } from 'libs/db/generated/client/enums';

export class OrdersPaginationDto extends PaginationRequestDto {
  @ApiPropertyOptional({ enum: OrderState, example: OrderState.PENDING })
  status?: OrderState;

  @ApiPropertyOptional({ example: 'IN_HOUSE' })
  source?: string;
}

export class ListOrdersReqDto {
  @ApiPropertyOptional({ example: 'branch-uuid-here' })
  branchId?: string;

  pagination: OrdersPaginationDto;
}

export class ListOrdersResDto extends PaginatedResponseDto<any> {}
