import {
  BranchMenuItemVariation,
  DietaryTag,
  RecipeItem,
} from "@/features/dashboard/menu-manager/types/Menu";
import type { MenuItemCategory } from "@/features/dashboard/menu-manager/types/AddItem";

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
  category: MenuItemCategory;
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
