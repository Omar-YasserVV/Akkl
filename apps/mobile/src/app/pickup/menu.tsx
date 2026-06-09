import { SharedMenuView } from "@/components/discovery/shared-menu-view";
import { type DiscoveryMenuItem } from "@repo/utils";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const FALLBACK_PICKUP_MENU: DiscoveryMenuItem[] = [
  {
    id: "pickup-grilled-salmon",
    branchId: "downtown-branch",
    menuItemId: "pickup-grilled-salmon",
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon herb butter and seasonal vegetables.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
    category: "Main Course",
    price: 23.50,
    discountPrice: null,
    preparationTime: 20,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: "akkl",
    restaurantName: "Smart Restaurant",
    branchName: "Downtown Branch",
  },
  {
    id: "pickup-quinoa-bowl",
    branchId: "downtown-branch",
    menuItemId: "pickup-quinoa-bowl",
    name: "Quinoa Grain Bowl",
    description: "Healthy quinoa loaded with fresh greens, avocados, and light dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    category: "Main Course",
    price: 22.00,
    discountPrice: null,
    preparationTime: 12,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: "akkl",
    restaurantName: "Smart Restaurant",
    branchName: "Downtown Branch",
  },
  {
    id: "pickup-wagyu-burger",
    branchId: "downtown-branch",
    menuItemId: "pickup-wagyu-burger",
    name: "Wagyu Beef Burger",
    description: "Premium wagyu patty, aged cheddar, and truffle aioli.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    category: "Main Course",
    price: 35.00,
    discountPrice: null,
    preparationTime: 18,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: "akkl",
    restaurantName: "Smart Restaurant",
    branchName: "Downtown Branch",
  },
  {
    id: "pickup-classic-caesar",
    branchId: "downtown-branch",
    menuItemId: "pickup-classic-caesar",
    name: "Classic Caesar",
    description: "Crispy romaine lettuce, parmesan shavings, and house croutons.",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80",
    category: "Appetizers",
    price: 18.50,
    discountPrice: null,
    preparationTime: 10,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: "akkl",
    restaurantName: "Smart Restaurant",
    branchName: "Downtown Branch",
  },
  {
    id: "pickup-truffle-fries",
    branchId: "downtown-branch",
    menuItemId: "pickup-truffle-fries",
    name: "Truffle Fries",
    description: "Hand-cut golden fries tossed with truffle oil and herbs.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    category: "Appetizers",
    price: 15.50,
    discountPrice: null,
    preparationTime: 8,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: "akkl",
    restaurantName: "Smart Restaurant",
    branchName: "Downtown Branch",
  },
  {
    id: "pickup-margherita",
    branchId: "downtown-branch",
    menuItemId: "pickup-margherita",
    name: "Margherita Pizza",
    description: "Classic Neapolitan style pizza with fresh mozzarella and basil.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    category: "Main Course",
    price: 45.00,
    discountPrice: null,
    preparationTime: 15,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: "akkl",
    restaurantName: "Smart Restaurant",
    branchName: "Downtown Branch",
  },
];

export default function PickupMenuScreen() {
  const { branchId } = useLocalSearchParams<{ branchId: string }>();

  const defaultBranchContext = {
    branchId: branchId || "downtown-branch",
    restaurantId: "akkl",
    restaurantName: "Smart Restaurant",
    branchName:
      branchId === "uptown-hub"
        ? "Uptown Hub"
        : branchId === "east-side-kitchen"
          ? "East Side Kitchen"
          : "Downtown Branch",
  };

  return (
    <SharedMenuView
      mode="pickup"
      branchId={branchId || "downtown-branch"}
      fallbackMenu={FALLBACK_PICKUP_MENU}
      cartRoute="/pickup/cart"
      defaultBranchContext={defaultBranchContext}
    />
  );
}
