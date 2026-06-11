import { FilterChips } from "@/components/discovery/filter-chips";
import { useMenu } from "@/hooks/useMenu";
import { useCartStore } from "@/stores/cart-store";
import { Ionicons } from "@expo/vector-icons";
import { type DiscoveryMenuItem } from "@repo/utils";
import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
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
  defaultTableNumber?: string;
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
  cartRoute,
  defaultTableNumber,
  defaultBranchContext,
}: SharedMenuViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const branchLabel = defaultBranchContext?.branchName ?? "Restaurant";

  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);

  // Fetch menu items via the new React Query hook
  const { data, isLoading } = useMenu(branchId);
  const menuItems = data?.items ?? [];

  useEffect(() => {
    if (mode !== "dine-in" || !defaultBranchContext || !defaultTableNumber) {
      return;
    }

    const { tableNumber, setDineInSession } = useCartStore.getState();
    if (!tableNumber) {
      setDineInSession({
        ...defaultBranchContext,
        tableNumber: defaultTableNumber,
      });
    }
  }, [mode, defaultBranchContext, defaultTableNumber]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(menuItems.map((item) => item.category)));
    return [
      { id: ALL_CATEGORY, label: "All" },
      ...unique.map((category) => ({ id: category, label: category })),
    ];
  }, [menuItems]);

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
          <View className="flex-1 items-center justify-center py-3">
            <Text
              className="text-[20px] font-bold text-[#1A1A1A]"
              numberOfLines={1}
            >
              Menu
            </Text>
            <Text className="text-[13px] font-semibold text-[#6E7682]">
              {branchLabel}
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

      <MenuList
        mode={mode}
        branchId={branchId}
        defaultBranchContext={defaultBranchContext}
        menuItems={menuItems}
        selectedCategory={selectedCategory}
        isLoading={isLoading}
      />
      <MenuCartBar cartRoute={cartRoute} />
    </View>
  );
}

function MenuList({
  mode,
  branchId,
  defaultBranchContext,
  menuItems,
  selectedCategory,
  isLoading,
}: {
  mode: "pickup" | "dine-in";
  branchId: string;
  defaultBranchContext?: SharedMenuViewProps["defaultBranchContext"];
  menuItems: DiscoveryMenuItem[];
  selectedCategory: string;
  isLoading: boolean;
}) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 44) / 2;
  const addItem = useCartStore((state) => state.addItem);

  // Sync with your cart storage side-effects upon a successful data fetch
  useEffect(() => {
    if (!isLoading && menuItems.length > 0 && mode === "pickup") {
      // Assuming your api context gives you access to data fields if needed,
      // fallback to default context or calculate what's needed for the cart store.
      if (defaultBranchContext) {
        useCartStore.getState().setBranchContext(defaultBranchContext);
      }
    }
  }, [isLoading, menuItems, mode, defaultBranchContext]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === ALL_CATEGORY) return menuItems;
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const handleQuickAdd = useCallback(
    (item: DiscoveryMenuItem) => {
      addItem({
        itemId: item.id,
        name: item.name,
        branchId: item.branchId,
        restaurantId:
          item.restaurantId ?? defaultBranchContext?.restaurantId ?? "akkl",
        restaurantName:
          item.restaurantName ??
          defaultBranchContext?.restaurantName ??
          "Smart Restaurant",
        quantity: 1,
        unitPrice: item.discountPrice ?? item.price,
        image: item.image,
      });
    },
    [addItem, defaultBranchContext],
  );

  const renderItem = useCallback(
    ({ item }: { item: DiscoveryMenuItem }) => (
      <MenuGridItem item={item} width={cardWidth} onAdd={handleQuickAdd} />
    ),
    [cardWidth, handleQuickAdd],
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#065FCC" />
      </View>
    );
  }

  return (
    <FlatList
      data={filteredItems}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 120,
      }}
      columnWrapperStyle={{ gap: 12 }}
      ItemSeparatorComponent={MenuItemSeparator}
      renderItem={renderItem}
      removeClippedSubviews
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
    />
  );
}

function MenuCartBar({ cartRoute }: { cartRoute: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const itemCount = useCartStore((state) => state.itemCount);
  const total = useCartStore((state) => state.total);

  if (itemCount <= 0) {
    return null;
  }

  return (
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
  );
}

const MenuItemSeparator = memo(function MenuItemSeparator() {
  return <View className="h-3" />;
});

const MenuGridItem = memo(function MenuGridItem({
  item,
  width,
  onAdd,
}: {
  item: DiscoveryMenuItem;
  width: number;
  onAdd: (item: DiscoveryMenuItem) => void;
}) {
  const handleAdd = useCallback(() => {
    onAdd(item);
  }, [item, onAdd]);

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
          onPress={handleAdd}
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
});
