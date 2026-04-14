import { ApiProperty } from '@nestjs/swagger';

class MetaDto {
  @ApiProperty() total!: number;
  @ApiProperty() lastPage!: number;
  @ApiProperty() currentPage!: number;
  @ApiProperty() perPage!: number;
  @ApiProperty() prev!: number | null;
  @ApiProperty() next!: number | null;
}

export class PaginatedResultDto<T> {
  data!: T[];

  @ApiProperty({ type: MetaDto })
  meta!: MetaDto;
}
