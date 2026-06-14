import { formatCurrency } from "@/utils/profile";
import React from "react";
import { Text, View } from "react-native";

type OrderHistoryStatsProps = {
  totalSpent: number;
  orderCount: number;
};

export function OrderHistoryStats({
  totalSpent,
  orderCount,
}: OrderHistoryStatsProps) {
  return (
    <View className="flex-row gap-3 mb-4">
      <View className="flex-1 bg-white rounded-2xl border border-gray-100 p-4">
        <Text className="text-xs text-[#9BA5B7] mb-1">Total Spent</Text>
        <Text className="text-lg font-bold text-[#2D2D2D]">
          {formatCurrency(totalSpent)}
        </Text>
      </View>
      <View className="flex-1 bg-white rounded-2xl border border-gray-100 p-4">
        <Text className="text-xs text-[#9BA5B7] mb-1">Orders</Text>
        <Text className="text-lg font-bold text-[#2D2D2D]">{orderCount}</Text>
      </View>
    </View>
  );
}
