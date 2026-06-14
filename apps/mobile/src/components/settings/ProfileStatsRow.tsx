import React from "react";
import { Text, View } from "react-native";

type ProfileStatsRowProps = {
  totalPoints: number;
  totalOrders: number;
};

export function ProfileStatsRow({ totalPoints, totalOrders }: ProfileStatsRowProps) {
  return (
    <View className="flex-row w-full mb-4">
      <View className="flex-1 items-center">
        <Text className="text-xs text-[#9BA5B7] mb-1">Total Points</Text>
        <Text className="text-xl font-bold text-[#2D2D2D]">{totalPoints}</Text>
      </View>
      <View className="w-px bg-gray-200" />
      <View className="flex-1 items-center">
        <Text className="text-xs text-[#9BA5B7] mb-1">Total Orders</Text>
        <Text className="text-xl font-bold text-[#2D2D2D]">{totalOrders}</Text>
      </View>
    </View>
  );
}
