// inventory.create.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseInventoryItemDto } from './Inventory.base.dto';

/**
 * Creating an InventoryItem only registers the ingredient+warehouse slot.
 * Actual stock comes in through the restock (StockBatch) flow.
 */
export class CreateInventoryItemReqDto {
  @ApiProperty({ example: 'uuid-here', description: 'Ingredient to track' })
  ingredientId: string;

  @ApiProperty({ example: 'uuid-here', description: 'Warehouse to store in' })
  warehouseId: string;

  @ApiProperty({
    example: 10,
    description:
      'Minimum quantity threshold — triggers low stock alert below this',
  })
  minimumQuantity: number;
}

export class CreateInventoryItemResDto extends BaseInventoryItemDto {}
