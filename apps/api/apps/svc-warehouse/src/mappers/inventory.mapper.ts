import { Ingredient, InventoryItem } from 'libs/db/generated/client/client';
import { GetInventoryItemResDto } from '../dto/inventory/inventory.get.dto';

type InventoryWithIngredient = InventoryItem & {
  ingredient: Ingredient;
};

export function toInventoryResDto(
  item: InventoryWithIngredient,
): GetInventoryItemResDto {
  return {
    id: item.id,
    ingredientId: item.ingredientId,
    quantity: item.quantity,
    minimumQuantity: item.minimumQuantity,
    stockStatus: item.stockStatus,
    warehouseId: item.warehouseId,
    ingredient: {
      name: item.ingredient.name,
      unit: item.ingredient.unit,
    },
  };
}
