import { WalletOption } from "@/types/payment";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type WalletOptionTileProps = {
  option: WalletOption;
  onPress: () => void;
};

export function WalletOptionTile({ option, onPress }: WalletOptionTileProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-1 min-w-[45%] bg-white border border-gray-100 rounded-2xl p-5 items-center mb-3"
    >
      <View className="w-14 h-14 rounded-2xl bg-[#E3F2FD] items-center justify-center mb-3">
        <Ionicons name={option.icon} size={28} color="#1565C0" />
      </View>
      <Text className="text-base font-semibold text-[#2D2D2D] mb-1">{option.label}</Text>
      <Text className="text-xs text-[#9BA5B7] text-center">{option.description}</Text>
    </TouchableOpacity>
  );
}
