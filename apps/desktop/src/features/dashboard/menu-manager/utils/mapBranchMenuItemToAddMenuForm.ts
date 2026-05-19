import type { BranchMenuItem } from "@/types/Menu";
import { ADD_MENU_ITEM_DEFAULT_VALUES } from "../constants/formConfig";
import { Size, type AddMenuItemFormData } from "../types/AddItem";

function toSize(value: string): Size {
  if (Object.values(Size).includes(value as Size)) {
    return value as Size;
  }

  const normalized = value.toUpperCase();
  if (Object.values(Size).includes(normalized as Size)) {
    return normalized as Size;
  }

  return Size.MEDIUM;
}

export function mapBranchMenuItemToAddMenuForm(
  item: BranchMenuItem,
): AddMenuItemFormData {
  return {
    ...ADD_MENU_ITEM_DEFAULT_VALUES,
    itemName: item.name,
    description: item.description ?? "",
    category: item.category,
    imageData: item.image,
    sizes:
      item.variations.length > 0
        ? item.variations.map((variation) => ({
            id: variation.id,
            name: toSize(variation.size),
            price: String(variation.price),
          }))
        : [
            {
              id: "1",
              name: Size.MEDIUM,
              price: String(item.price ?? "0.00"),
            },
          ],
    recipeRows: item.recipe.map((recipeLine) => ({
      id: recipeLine.id,
      ingredientId: recipeLine.ingredientId,
      quantityRequired: String(recipeLine.quantityRequired),
    })),
    addOns: [],
    selectedSauceChoiceIds: [],
    dietaryTags: item.dietaryTags.map((tag) => tag.name),
    inStock: item.isAvailable,
    visibleOnApp: true,
  };
}
