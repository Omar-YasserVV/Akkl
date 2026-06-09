import { BottomTabInset } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-[#F7F8FA] px-7"
      style={{ paddingTop: insets.top + 24, paddingBottom: BottomTabInset }}
    >
      <Text className="text-[32px] leading-10 font-extrabold text-[#171B20]">
        Orders
      </Text>
      <View className="flex-1 items-center justify-center">
        <View className="h-20 w-20 rounded-full bg-[#DDE5FF] items-center justify-center mb-5">
          <Ionicons name="receipt-outline" size={38} color="#065FCC" />
        </View>
        <Text className="text-[22px] leading-8 font-bold text-[#20242A]">
          No orders yet
        </Text>
        <Text className="mt-2 text-center text-[16px] leading-6 text-[#6B7280]">
          Your current and past orders will appear here.
        </Text>
      </View>
    </View>
  );
}
