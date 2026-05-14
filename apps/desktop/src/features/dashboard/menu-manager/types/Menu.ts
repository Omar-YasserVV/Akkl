export interface DietaryTag {
  id: string;
  name: "VEGAN" | "GLUTEN_FREE" | string; // Matches 'VEGAN', 'GLUTEN_FREE', etc.
}

export interface RecipeItem {
  id: string;
  menuItemId: string;
  ingredientId: string;
  quantityRequired: number;
  ingredient: Ingredient;
}

export interface MenuItemSummary {
  totalItems: number;
  availableItems: number;
  averagePrice: string;
  categories: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category: "PRODUCE" | "DRY_GOODS" | string;
  unit: "KG" | "G" | "L" | "ML" | string;
}

export interface BranchMenuItemVariation {
  id: string;
  branchMenuItemId: string;
  size: "Small" | "Medium" | "Large" | string;
  price: string; // Stored as string in JSON (e.g., "3.49")
  discountPrice: string | null;
}
