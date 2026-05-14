export interface MenuItemSummary {
  totalItems: number;
  availableItems: number;
  averagePrice: string | number;
  categories: number;
}

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
