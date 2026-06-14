import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export function SecurityBanner() {
  return (
    <View className="bg-[#E8F1FF] rounded-2xl p-4 mb-4 flex-row">
      <View className="w-10 h-10 rounded-full bg-primary/15 items-center justify-center mr-3">
        <Ionicons name="shield-checkmark" size={20} color="#0057C0" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-[#2D2D2D] mb-1">
          Secure Payment
        </Text>
        <Text className="text-xs text-[#5F6B7A] leading-5">
          Your payment information is encrypted and stored securely. We never share
          your card details with merchants.
        </Text>
      </View>
    </View>
  );
}
