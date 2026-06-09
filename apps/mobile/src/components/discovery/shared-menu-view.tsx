import { FilterChips } from "@/components/discovery/filter-chips";
import { useCart } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { discoveryApis, type DiscoveryMenuItem } from "@repo/utils";
import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ALL_CATEGORY = "all";
const formatPrice = (price: number) => `${price.toFixed(2)} LE`;

interface SharedMenuViewProps {
  mode: "pickup" | "dine-in";
  branchId: string;
  fallbackMenu: DiscoveryMenuItem[];
  cartRoute: string;
  defaultTableNumber?: string; // only used in dine-in
  defaultBranchContext?: {
    branchId: string;
    restaurantId: string;
    restaurantName: string;
    branchName: string;
  };
}

export function SharedMenuView({
  mode,
  branchId,
  fallbackMenu,
  cartRoute,
  defaultTableNumber,
  defaultBranchContext,
}: SharedMenuViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 44) / 2;

  const {
    addItem,
    itemCount,
    total,
    branchName,
    setBranchContext,
    setDineInSession,
    tableNumber,
  } = useCart();

  const [menuItems, setMenuItems] = useState<DiscoveryMenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session/context based on mode
  useEffect(() => {
    if (mode === "dine-in" && defaultBranchContext && defaultTableNumber) {
      if (!tableNumber) {
        setDineInSession({
          ...defaultBranchContext,
          tableNumber: defaultTableNumber,
        });
      }
    }
  }, [mode, defaultBranchContext, defaultTableNumber, setDineInSession, tableNumber]);

  // Load menu for selected branch
  const loadMenu = useCallback(async () => {
    if (!branchId) return;
    setIsLoading(true);
    try {
      const data = await discoveryApis.getBranchMenu(branchId);
      const items = data.categories.flatMap((section) => section.items);
      setMenuItems(items.length ? items : fallbackMenu);

      if (mode === "pickup") {
        setBranchContext({
          branchId: data.branch.id,
          restaurantId: data.branch.restaurant.id,
          restaurantName: data.branch.restaurant.name,
          branchName: data.branch.name,
        });
      }
    } catch (error) {
      console.warn("Failed to load menu, using fallback data", error);
      
      // Fallback behavior when API fails
      if (mode === "pickup" && defaultBranchContext) {
        setBranchContext(defaultBranchContext);
      }
      setMenuItems(fallbackMenu);
    } finally {
      setIsLoading(false);
    }
  }, [branchId, fallbackMenu, mode, setBranchContext, defaultBranchContext]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(menuItems.map((item) => item.category)));
    return [
      { id: ALL_CATEGORY, label: "All" },
      ...unique.map((category) => ({ id: category, label: category })),
    ];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === ALL_CATEGORY) return menuItems;
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const handleQuickAdd = (item: DiscoveryMenuItem) => {
    addItem({
      itemId: item.id,
      name: item.name,
      branchId: item.branchId,
      restaurantId: item.restaurantId ?? (defaultBranchContext?.restaurantId || "akkl"),
      restaurantName: item.restaurantName ?? (defaultBranchContext?.restaurantName || "Smart Restaurant"),
      quantity: 1,
      unitPrice: item.discountPrice ?? item.price,
      image: item.image,
    });
  };

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white px-5 pb-4 border-b border-[#E8EBF0]"
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View className="flex-1 items-center justify-center">
            <Text className="text-[20px] font-bold text-[#1A1A1A]" numberOfLines={1}>
              Menu
            </Text>
            <Text className="text-[13px] font-semibold text-[#6E7682]">
              {mode === "dine-in" 
                ? (defaultBranchContext?.branchName || "Smart Restaurant") 
                : (branchName || "Smart Restaurant")}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/search")}>
            <Ionicons name="search" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
        <FilterChips
          chips={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#065FCC" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: itemCount > 0 ? 120 : 32,
          }}
          columnWrapperStyle={{ gap: 12 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <MenuGridItem
              item={item}
              width={cardWidth}
              onAdd={() => handleQuickAdd(item)}
            />
          )}
        />
      )}

      {itemCount > 0 ? (
        <View
          className="absolute left-4 right-4"
          style={{ bottom: insets.bottom + 16 }}
        >
          <TouchableOpacity
            onPress={() => router.push(cartRoute as Href)}
            activeOpacity={0.9}
            className="h-[56px] rounded-[12px] bg-[#065FCC] px-5 flex-row items-center justify-between"
          >
            <Text className="text-[17px] font-bold text-white">
              View Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
            </Text>
            <Text className="text-[17px] font-bold text-white">
              {formatPrice(total)}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

function MenuGridItem({
  item,
  width,
  onAdd,
}: {
  item: DiscoveryMenuItem;
  width: number;
  onAdd: () => void;
}) {
  return (
    <View
      className="bg-white rounded-[12px] overflow-hidden border border-[#E8EBF0]"
      style={{ width }}
    >
      <View className="relative">
        <Image
          source={{
            uri:
              item.image ??
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          }}
          style={{ width: "100%", height: 130 }}
          contentFit="cover"
        />
        <TouchableOpacity
          onPress={onAdd}
          activeOpacity={0.9}
          className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#065FCC] items-center justify-center"
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View className="p-3">
        <Text
          className="text-[15px] font-bold text-[#1A1A1A]"
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <Text className="mt-1 text-[15px] font-bold text-[#065FCC]">
          {formatPrice(item.discountPrice ?? item.price)}
        </Text>
      </View>
    </View>
  );
}
