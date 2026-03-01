export interface ItemOption {
  id: string;
  name: string;
  price: string;
}

export type SpicinessLevel = "mild" | "hot" | "extra";

export interface AddMenuItemFormData {
  itemName: string;
  description: string;
  imageData: string | null;
  sizes: ItemOption[];
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
