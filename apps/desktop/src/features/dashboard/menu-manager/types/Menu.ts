export interface BranchMenuItem {
  id: string;
  branchId: string;
  menuItemId: string;
  category: category;
  price: number;
  discountPrice: number | null;
  preparationTime: number;
  name: string;
  description: string | null;
  image: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  dietaryTags: DietaryTag[];
  recipe: RecipeItem[];
  variations: BranchMenuItemVariation[];
}

enum category {
  APPETIZER = "APPETIZER",
  MAIN_COURSE = "MAIN_COURSE",
  DESSERT = "DESSERT",
  BEVERAGE = "BEVERAGE",
  SIDE_DISH = "SIDE_DISH",
  OTHER = "OTHER",
}
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
