import { Order, OrderStatus } from "@/orders/types/PaginatedResponse";
import { formatOrderLineLabel } from "@/orders/utils/orderDetails";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const STATUS_STYLES: Record<
  OrderStatus,
  { bg: string; text: string; label: string }
> = {
  COMPLETED: { bg: "#E6F4EA", text: "#137333", label: "Completed" },
  IN_PROGRESS: { bg: "#E8F0FE", text: "#1A73E8", label: "In Progress" },
  PENDING: { bg: "#FEF7E0", text: "#B06000", label: "Pending" },
  CANCELLED: { bg: "#FCE8E6", text: "#C5221F", label: "Cancelled" },
};

type OrderHistoryCardProps = {
  order: Order;
  onReorder?: () => void;
  onDetails?: () => void;
};

export function OrderHistoryCard({
  order,
  onReorder,
  onDetails,
}: OrderHistoryCardProps) {
  const status = STATUS_STYLES[order.status];
  const itemImage = order.items?.[0]?.branchMenuItem?.image;
  const itemSummary = order.items?.length
    ? order.items.map(formatOrderLineLabel).join(", ")
    : `${order.itemCount} items`;

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-3">
      <View className="flex-row">
        {itemImage ? (
          <Image
            source={{ uri: itemImage }}
            style={{ width: 64, height: 64, borderRadius: 12 }}
            contentFit="cover"
          />
        ) : (
          <View className="w-16 h-16 rounded-xl bg-[#F0F2F5] items-center justify-center">
            <Ionicons name="fast-food-outline" size={24} color="#9BA5B7" />
          </View>
        )}
        <View className="flex-1 ml-3">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 text-base font-semibold text-[#2D2D2D] mr-2" numberOfLines={1}>
              {itemSummary}
            </Text>
            <View
              className="rounded-md px-2 py-1"
              style={{ backgroundColor: status.bg }}
            >
              <Text className="text-[10px] font-bold" style={{ color: status.text }}>
                {status.label}
              </Text>
            </View>
          </View>
          <Text className="text-sm font-bold text-primary mt-1">
            {Number.parseFloat(order.totalPrice).toFixed(0)} LE
          </Text>
          <Text className="text-xs text-[#9BA5B7] mt-1">{formattedDate}</Text>
        </View>
      </View>
      <View className="flex-row gap-2 mt-3">
        <TouchableOpacity
          onPress={onReorder}
          className="flex-1 bg-primary rounded-xl py-2.5 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-sm font-semibold text-white">Reorder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDetails}
          className="flex-1 border border-gray-200 rounded-xl py-2.5 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-sm font-semibold text-[#2D2D2D]">Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
