import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderState, source } from 'libs/db/generated/client/enums';
export class PaginationRequestDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Current page number',
    default: 1,
  })
  page: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
    default: 10,
  })
  limit: number;

  @ApiPropertyOptional({
    example: 'PENDING',
    description: 'Status filter',
  })
  status?: OrderState;

  @ApiPropertyOptional({
    example: 'MOBILE_APP',
    description: 'Order source filter',
  })
  source?: source;
}

class MetaDto {
  @ApiProperty() total!: number;
  @ApiProperty() pages!: number;
  @ApiProperty() currentPage!: number;
  @ApiProperty() limit!: number;
}

export class PaginatedResponseDto<T> {
  data!: T[];

  @ApiProperty({ type: MetaDto })
  meta!: MetaDto;
}
