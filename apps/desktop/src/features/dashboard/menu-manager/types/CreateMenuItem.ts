/** Mirrors `BranchMenuItemDetailDto` for POST `/branches/menu` */

import type { MenuItemCategory, Size } from "./AddItem";

export interface CreateMenuVariationPayload {
  size: Size;
  price: number;
  discountPrice?: number;
}

export interface CreateMenuRecipeLinePayload {
  ingredientId: string;
  quantityRequired: number;
}

export interface CreateBranchMenuItemPayload {
  menuItemId: string;
  branchId: string;
  name: string;
  description?: string;
  image?: string;
  isAvailable: boolean;
  category: MenuItemCategory;
  price: number;
  discountPrice?: number;
  preparationTime: number;
  variations: CreateMenuVariationPayload[];
  dietaryTags?: string[];
  recipe: CreateMenuRecipeLinePayload[];
}
