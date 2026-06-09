import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ProfileMenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showBorder?: boolean;
};

export function ProfileMenuItem({
  icon,
  label,
  value,
  onPress,
  showBorder = true,
}: ProfileMenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center px-4 py-4 ${showBorder ? "border-b border-gray-100" : ""}`}
    >
      <View className="w-10 h-10 rounded-xl bg-[#E3F2FD] items-center justify-center mr-3">
        <Ionicons name={icon} size={20} color="#1565C0" />
      </View>
      <Text className="flex-1 text-base font-medium text-[#2D2D2D]">{label}</Text>
      {value ? (
        <Text className="text-sm text-[#9BA5B7] mr-2">{value}</Text>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color="#C5CAD3" />
    </TouchableOpacity>
  );
}
