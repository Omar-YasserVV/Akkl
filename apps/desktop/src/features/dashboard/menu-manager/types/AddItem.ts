export enum Size {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export type MenuItemCategory =
  | "APPETIZER"
  | "MAIN_COURSE"
  | "DESSERT"
  | "BEVERAGE"
  | "SIDE_DISH"
  | "OTHER";

export interface ItemOption {
  id: string;
  name: string;
  price: string;
}

export interface VariationOption {
  id: string;
  name: Size | "";
  price: string;
}

/** One recipe line: ingredient from warehouse + quantity used in dish */
export interface RecipeRow {
  id: string;
  ingredientId: string;
  quantityRequired: string;
}

export type SpicinessLevel = "mild" | "hot" | "extra";

export interface AddMenuItemFormData {
  itemName: string;
  description: string;
  category: MenuItemCategory;
  imageData: string | null;
  sizes: VariationOption[];
  /** Ingredient lines sent as `recipe` on create */
  recipeRows: RecipeRow[];
  addOns: ItemOption[];
  /** Multi-select: ids of selected sauce choices */
  selectedSauceChoiceIds: string[];
  /** Multi-select: e.g. "vegan", "gluten-free", "dairy-free" */
  dietaryTags: string[];
  /** Single select: mild | hot | extra */
  spicinessLevel: SpicinessLevel;
  inStock: boolean;
  visibleOnApp: boolean;
}
