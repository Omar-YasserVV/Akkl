import type { DiscoveryMenuItem } from "@repo/utils";

export const DINE_IN_BRANCH = {
  branchId: "downtown-branch",
  restaurantId: "akkl",
  restaurantName: "Akkl",
  branchName: "Downtown Branch",
};

export const FALLBACK_DINE_IN_MENU: DiscoveryMenuItem[] = [
  {
    id: "dine-grilled-salmon",
    branchId: DINE_IN_BRANCH.branchId,
    menuItemId: "dine-grilled-salmon",
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon herb butter and seasonal vegetables.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
    category: "Main Course",
    price: 38.5,
    discountPrice: null,
    preparationTime: 20,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: DINE_IN_BRANCH.restaurantId,
    restaurantName: DINE_IN_BRANCH.restaurantName,
    branchName: DINE_IN_BRANCH.branchName,
  },
  {
    id: "dine-wagyu-burger",
    branchId: DINE_IN_BRANCH.branchId,
    menuItemId: "dine-wagyu-burger",
    name: "Wagyu Beef Burger",
    description: "Premium wagyu patty, aged cheddar, and truffle aioli.",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    category: "Main Course",
    price: 32,
    discountPrice: null,
    preparationTime: 18,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: DINE_IN_BRANCH.restaurantId,
    restaurantName: DINE_IN_BRANCH.restaurantName,
    branchName: DINE_IN_BRANCH.branchName,
  },
  {
    id: "dine-margherita",
    branchId: DINE_IN_BRANCH.branchId,
    menuItemId: "dine-margherita",
    name: "Margherita Pizza",
    description: "San Marzano tomatoes, fresh mozzarella, and basil.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    category: "Main Course",
    price: 16,
    discountPrice: null,
    preparationTime: 15,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: DINE_IN_BRANCH.restaurantId,
    restaurantName: DINE_IN_BRANCH.restaurantName,
    branchName: DINE_IN_BRANCH.branchName,
  },
  {
    id: "dine-garlic-knots",
    branchId: DINE_IN_BRANCH.branchId,
    menuItemId: "dine-garlic-knots",
    name: "Garlic Knots",
    description: "Warm knots brushed with garlic butter and parsley.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    category: "Appetizers",
    price: 6,
    discountPrice: null,
    preparationTime: 8,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: DINE_IN_BRANCH.restaurantId,
    restaurantName: DINE_IN_BRANCH.restaurantName,
    branchName: DINE_IN_BRANCH.branchName,
  },
  {
    id: "dine-bruschetta",
    branchId: DINE_IN_BRANCH.branchId,
    menuItemId: "dine-bruschetta",
    name: "Tomato Bruschetta",
    description: "Toasted ciabatta topped with marinated tomatoes and basil.",
    image:
      "https://images.unsplash.com/photo-1572695157366-5e585ab412b6?auto=format&fit=crop&w=600&q=80",
    category: "Appetizers",
    price: 9.5,
    discountPrice: null,
    preparationTime: 10,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: DINE_IN_BRANCH.restaurantId,
    restaurantName: DINE_IN_BRANCH.restaurantName,
    branchName: DINE_IN_BRANCH.branchName,
  },
  {
    id: "dine-cold-brew",
    branchId: DINE_IN_BRANCH.branchId,
    menuItemId: "dine-cold-brew",
    name: "Iced Cold Brew",
    description: "Slow-steeped cold brew served over ice.",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565171b?auto=format&fit=crop&w=600&q=80",
    category: "Drinks",
    price: 5.5,
    discountPrice: null,
    preparationTime: 3,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: DINE_IN_BRANCH.restaurantId,
    restaurantName: DINE_IN_BRANCH.restaurantName,
    branchName: DINE_IN_BRANCH.branchName,
  },
];

export const DINE_IN_RECOMMENDATIONS = FALLBACK_DINE_IN_MENU.filter((item) =>
  ["dine-garlic-knots", "dine-cold-brew"].includes(item.id),
);

export function parseTableQr(data: string): string | null {
  const trimmed = data.trim();

  const tableMatch = trimmed.match(/table[:\/#=](\d+)/i);
  if (tableMatch) return tableMatch[1];

  const akklMatch = trimmed.match(/akkl:table:(\d+)/i);
  if (akklMatch) return akklMatch[1];

  if (/^\d+$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const tableParam = url.searchParams.get("table");
    if (tableParam) return tableParam;
  } catch {
    // not a URL
  }

  return null;
}

export const formatPrice = (price: number) => `${price.toFixed(2)} LE`;
