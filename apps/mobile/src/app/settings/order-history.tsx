import { OrderHistoryCard } from "@/components/settings/OrderHistoryCard";
import { OrderHistoryStats } from "@/components/settings/OrderHistoryStats";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { BottomTabInset } from "@/constants/theme";
import { useOrderHistory } from "@/hooks/profile/useOrderHistory";
import { appHref } from "@/lib/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, summary, isLoading, isRefetching, refetch, isError } =
    useOrderHistory();

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <SettingsHeader
        title="Order History"
        rightAction={<Ionicons name="filter" size={19} color="#5F6B7A" />}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: BottomTabInset + insets.bottom + 24,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
        <OrderHistoryStats
          totalSpent={summary.totalSpent}
          orderCount={summary.orderCount}
        />

        {isLoading ? (
          <ActivityIndicator color="#0057C0" className="mt-8" />
        ) : isError ? (
          <Text className="text-center text-[#9BA5B7] mt-8">
            Unable to load orders. Pull to refresh.
          </Text>
        ) : orders.length === 0 ? (
          <Text className="text-center text-[#9BA5B7] mt-8">No orders yet</Text>
        ) : (
          orders.map((order) => (
            <OrderHistoryCard
              key={order.id}
              order={order}
              onReorder={() => router.push(appHref("/quick-reorder"))}
              onDetails={() => router.push(appHref("/(tabs)/orders"))}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
