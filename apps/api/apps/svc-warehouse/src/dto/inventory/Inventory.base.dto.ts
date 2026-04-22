// inventory.base.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { stockStatus } from 'libs/db/generated/client/enums';

export class IngredientDto {
  @ApiProperty({ example: 'Flour' })
  name: string;

  @ApiProperty({ example: 'kg' })
  unit: string;
}

export class BaseInventoryItemDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 50 })
  quantity: number;

  @ApiProperty({ example: 10 })
  minimumQuantity: number;

  @ApiProperty({ enum: stockStatus, example: stockStatus.IN_STOCK })
  stockStatus: stockStatus;

  @ApiProperty({ example: 'uuid-here' })
  ingredientId: string;

  @ApiProperty({ example: 'uuid-here' })
  warehouseId: string;

  @ApiProperty({ type: () => IngredientDto })
  ingredient: IngredientDto;
}
