// inventory.mapper.ts
import {
  Ingredient,
  InventoryItem,
  StockBatch,
} from 'libs/db/generated/client/client';
import { GetInventoryItemResDto } from '../dto/inventory/inventory.get.dto';

type InventoryWithRelations = InventoryItem & {
  ingredient: Ingredient;
  batches: StockBatch[];
};

export function toInventoryResDto(
  item: InventoryWithRelations,
): GetInventoryItemResDto {
  return {
    id: item.id,
    ingredientId: item.ingredientId,
    warehouseId: item.warehouseId,
    quantity: item.quantity,
    minimumQuantity: item.minimumQuantity,
    stockStatus: item.stockStatus,
    ingredient: {
      id: item.ingredient.id,
      name: item.ingredient.name,
      category: item.ingredient.category,
      unit: item.ingredient.unit,
    },
    batches: item.batches.map((batch) => ({
      id: batch.id,
      initialQuantity: batch.initialQuantity,
      remainingQuantity: batch.remainingQuantity,
      numberOfUnits: batch.numberOfUnits,
      unitSize: batch.unitSize,
      receivedAt: batch.receivedAt,
      expiresAt: batch.expiresAt,
      status: batch.status,
    })),
  };
}
