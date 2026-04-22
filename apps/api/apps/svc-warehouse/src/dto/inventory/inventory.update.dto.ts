// inventory.update.dto.ts
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { BaseInventoryItemDto } from './Inventory.base.dto';

// ─── CONSUME ─────────────────────────────────────────────────────────────────

export class ConsumeInventoryItemReqDto extends PickType(BaseInventoryItemDto, [
  'id',
]) {
  @ApiProperty({
    example: 5,
    description:
      'Total quantity to consume — deducted across batches using FEFO (soonest expiry first)',
  })
  consumedQuantity: number;
}

export class ConsumeInventoryItemResDto extends BaseInventoryItemDto {}

// ─── RESTOCK ─────────────────────────────────────────────────────────────────

/**
 * Restocking creates a new StockBatch instead of directly adding to the item quantity.
 * The item's total quantity is updated to reflect the new batch.
 */
export class RestockInventoryItemReqDto extends PickType(BaseInventoryItemDto, [
  'id',
]) {
  @ApiProperty({
    example: 50,
    description: 'Total quantity received in this delivery (e.g. 50kg)',
  })
  addedQuantity: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Number of physical units received (e.g. 5 bags)',
  })
  numberOfUnits?: number;

  @ApiPropertyOptional({
    example: 10,
    description:
      'Size of each unit (e.g. 10kg per bag) — for worker clarity only',
  })
  unitSize?: number;

  @ApiPropertyOptional({
    example: '2025-12-31T00:00:00.000Z',
    description: 'Expiry date for this specific batch',
  })
  expiresAt?: Date;
}

export class RestockInventoryItemResDto extends BaseInventoryItemDto {}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export class UpdateInventoryItemReqDto extends IntersectionType(
  PartialType(
    PickType(BaseInventoryItemDto, ['minimumQuantity', 'ingredientId']),
  ),
  PickType(BaseInventoryItemDto, ['id']),
) {}

export class UpdateInventoryItemResDto extends BaseInventoryItemDto {}
