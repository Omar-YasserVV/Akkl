import type { DiscoveryRestaurant } from "@repo/utils";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RestaurantCardProps {
  restaurant: DiscoveryRestaurant;
  onPress: () => void;
  compact?: boolean;
}

export function RestaurantCard({
  restaurant,
  onPress,
  compact,
}: RestaurantCardProps) {
  const distance = restaurant.nearestBranch?.distanceKm;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden ${
        compact ? "w-40 mr-3" : "mb-3"
      }`}
      activeOpacity={0.85}
    >
      <View className={compact ? "p-3" : "p-4 flex-row items-center"}>
        <View
          className={`rounded-xl overflow-hidden bg-gray-100 ${
            compact ? "w-full h-24 mb-2" : "w-14 h-14 mr-3"
          }`}
        >
          {restaurant.logoUrl ? (
            <Image
              source={{ uri: restaurant.logoUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : null}
        </View>
        <View className={compact ? "" : "flex-1"}>
          <Text
            className="font-semibold text-[#2D2D2D]"
            numberOfLines={compact ? 2 : 1}
          >
            {restaurant.name}
          </Text>
          <Text className="text-xs text-[#9BA5B7] mt-1">
            {restaurant.cuisineLabel}
            {distance != null ? ` · ${distance.toFixed(1)} km` : ""}
          </Text>
          {!compact && restaurant.nearestBranch ? (
            <Text className="text-xs text-primary mt-1">
              {restaurant.nearestBranch.openStatus === "OPEN"
                ? `Open${restaurant.nearestBranch.openUntil ? ` until ${restaurant.nearestBranch.openUntil}` : ""}`
                : restaurant.nearestBranch.openStatus.replace("_", " ")}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}
