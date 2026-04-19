// inventory.create.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseInventoryItemDto } from './inventory.base.dto';

export class CreateInventoryItemReqDto {
  @ApiProperty({ example: 'uuid-here', description: 'Ingredient to track' })
  ingredientId: string;

  @ApiProperty({ example: 'uuid-here', description: 'Warehouse to store in' })
  warehouseId: string;

  @ApiProperty({ example: 50 })
  quantity: number;

  @ApiProperty({
    example: 10,
    description: 'Triggers low stock alert below this',
  })
  minimumQuantity: number;
}

export class CreateInventoryItemResDto extends BaseInventoryItemDto {}
