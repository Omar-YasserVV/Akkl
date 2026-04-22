// inventory.base.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BatchStatus,
  IngredientCategory,
  MeasurementUnit,
  stockStatus,
} from 'libs/db/generated/client/enums';

export class IngredientDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Flour' })
  name: string;

  @ApiProperty({ enum: MeasurementUnit, example: MeasurementUnit.KG })
  unit: MeasurementUnit;

  @ApiProperty({ enum: IngredientCategory, example: IngredientCategory.GRAINS })
  category: IngredientCategory;
}

export class StockBatchDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({
    example: 50,
    description: 'Total quantity received in this batch',
  })
  initialQuantity: number;

  @ApiProperty({ example: 30, description: 'Remaining quantity in this batch' })
  remainingQuantity: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Number of physical units (e.g. bags, boxes)',
  })
  numberOfUnits: number | null;

  @ApiPropertyOptional({
    example: 10,
    description: 'Size of each unit (e.g. 10kg per bag)',
  })
  unitSize: number | null;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  receivedAt: Date;

  @ApiPropertyOptional({ example: '2025-12-31T00:00:00.000Z', nullable: true })
  expiresAt: Date | null;

  @ApiProperty({ enum: BatchStatus, example: BatchStatus.ACTIVE })
  status: BatchStatus;
}

export class BaseInventoryItemDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  /**
   * Total quantity = sum of all active batch remainingQuantity.
   * Always kept in sync after every consume/restock.
   */
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

  @ApiProperty({ type: () => [StockBatchDto] })
  batches: StockBatchDto[];
}
