import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
