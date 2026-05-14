import type { MenuItemSummary } from "../types/Menu";

export const MenuManagerCards_Metadata: {
  id: keyof MenuItemSummary;
  title: string;
}[] = [
  {
    id: "totalItems",
    title: "Total Items",
  },
  {
    id: "availableItems",
    title: "Available",
  },
  {
    id: "averagePrice",
    title: "Avg Price",
  },
  {
    id: "categories",
    title: "Categories",
  },
];
