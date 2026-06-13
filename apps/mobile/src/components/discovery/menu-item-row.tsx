import type { DiscoveryMenuItem } from "@repo/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { formatMenuItemPrice, hasVariations } from "@/utils/menuItem";

interface MenuItemRowProps {
  item: DiscoveryMenuItem;
  onPress: () => void;
  onAdd?: () => void;
  showRestaurant?: boolean;
}

export function MenuItemRow({
  item,
  onPress,
  onAdd,
  showRestaurant = true,
}: MenuItemRowProps) {
  const formatPrice = (price: number) => `${price.toFixed(2)} LE`;
  const priceLabel = formatMenuItemPrice(item, formatPrice);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white rounded-2xl border border-gray-100 p-3 mb-3"
      activeOpacity={0.85}
    >
      <View className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden">
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : null}
      </View>

      <View className="flex-1 ml-3">
        {showRestaurant && item.restaurantName ? (
          <Text className="text-xs text-primary font-medium mb-0.5">
            {item.restaurantName}
          </Text>
        ) : null}
        <Text className="font-semibold text-[#2D2D2D]" numberOfLines={1}>
          {item.name}
        </Text>
        {item.description ? (
          <Text className="text-xs text-[#9BA5B7] mt-1" numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <View className="flex-row items-center mt-2">
          {item.discountPrice && !hasVariations(item) ? (
            <Text className="text-xs text-[#9BA5B7] line-through mr-2">
              {item.price.toFixed(2)} LE
            </Text>
          ) : null}
          <Text className="text-sm font-bold text-primary">{priceLabel}</Text>
        </View>
      </View>

      {onAdd ? (
        <TouchableOpacity
          onPress={onAdd}
          className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center ml-2"
        >
          <Ionicons name="add" size={20} color="#1565C0" />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}
