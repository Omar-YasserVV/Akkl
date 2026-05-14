import type {
  AddMenuItemFormData,
  MenuItemCategory,
  SpicinessLevel,
} from "../types/AddItem";
import { Size } from "../types/AddItem";

export const MENU_CATEGORY_OPTIONS: {
  value: MenuItemCategory;
  label: string;
}[] = [
  { value: "APPETIZER", label: "Appetizer" },
  { value: "MAIN_COURSE", label: "Main Course" },
  { value: "DESSERT", label: "Dessert" },
  { value: "BEVERAGE", label: "Beverage" },
  { value: "SIDE_DISH", label: "Side Dish" },
  { value: "OTHER", label: "Other" },
];

export const MENU_SIZE_OPTIONS: { value: Size; label: string }[] = [
  { value: Size.SMALL, label: "Small" },
  { value: Size.MEDIUM, label: "Medium" },
  { value: Size.LARGE, label: "Large" },
];

export const ADD_MENU_ITEM_DEFAULT_VALUES: AddMenuItemFormData = {
  itemName: "",
  description: "",
  category: "MAIN_COURSE",
  imageData: null,
  sizes: [{ id: "1", name: Size.MEDIUM, price: "12.99" }],
  recipeRows: [],
  addOns: [
    { id: "1", name: "Extra Cheese", price: "2.00" },
    { id: "2", name: "Bacon Strips", price: "3.50" },
  ],
  selectedSauceChoiceIds: ["bbq"],
  dietaryTags: ["vegan"],
  spicinessLevel: "mild",
  inStock: true,
  visibleOnApp: true,
};

/** Static sauce choices for Choices (Sauce) – replace with API later */
export const SAUCE_CHOICES = [
  { id: "bbq", name: "BBQ Sauce" },
  { id: "spicy-mayo", name: "Spicy Mayo" },
] as const;

/** Dietary tag options – replace with API later */
export const DIETARY_TAG_OPTIONS = [
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
] as const;

export const SPICINESS_OPTIONS: {
  id: SpicinessLevel;
  label: string;
  chiliCount: number;
}[] = [
  { id: "mild", label: "MILD", chiliCount: 2 },
  { id: "hot", label: "HOT", chiliCount: 3 },
  { id: "extra", label: "EXTRA", chiliCount: 5 },
];
