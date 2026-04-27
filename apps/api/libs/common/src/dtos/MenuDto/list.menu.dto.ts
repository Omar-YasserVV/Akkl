import { PaginationRequestDto } from '@app/common/dtos/PaginationDto/paginated-result.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { category } from 'libs/db/generated/client/client';

export class MenuPaginationDto extends PaginationRequestDto {
  @ApiPropertyOptional({ enum: category, example: category.APPETIZER })
  category?: category;

  @ApiPropertyOptional({ example: true })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  isAvailable?: boolean;
}
