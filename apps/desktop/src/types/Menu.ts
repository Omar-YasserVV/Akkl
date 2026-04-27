import {
  BranchMenuItemVariation,
  DietaryTag,
  RecipeItem,
} from "@/features/dashboard/menu-manager/types/Menu";

export interface MenuFilters {
  page: number;
  limit: number;
  category?: string;
  isAvailable?: boolean;
}

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
