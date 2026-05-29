import { PaginationRequestDto } from '@app/common/dtos/PaginationDto/paginated-result.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { MenuCategory } from '../../../../db/generated/client/client';

export class MenuPaginationDto extends PaginationRequestDto {
  @ApiPropertyOptional({ enum: MenuCategory, example: MenuCategory.APPETIZER })
  category?: MenuCategory;

  @ApiPropertyOptional({ example: true })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  isAvailable?: boolean;
}
