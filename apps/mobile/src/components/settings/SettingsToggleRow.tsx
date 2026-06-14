import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";

type SettingsToggleRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showBorder?: boolean;
};

export function SettingsToggleRow({
  icon,
  label,
  description,
  value,
  onValueChange,
  showBorder = true,
}: SettingsToggleRowProps) {
  return (
    <View
      className={`flex-row items-center px-4 py-3 ${showBorder ? "border-b border-gray-100" : ""}`}
    >
      <View className="w-8 h-8 rounded-full bg-[#EAF3FF] items-center justify-center mr-3">
        <Ionicons name={icon} size={17} color="#0066D9" />
      </View>
      <View className="flex-1">
        <Text className="text-[13px] font-bold text-[#2D2D2D]">{label}</Text>
        {description ? (
          <Text className="text-[10px] text-[#8B95A4] mt-0.5">{description}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
        thumbColor={value ? "#0057C0" : "#F9FAFB"}
      />
    </View>
  );
}

type SettingsLinkRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  value?: string;
  onPress?: () => void;
  showBorder?: boolean;
};

export function SettingsLinkRow({
  icon,
  label,
  description,
  value,
  onPress,
  showBorder = true,
}: SettingsLinkRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center px-4 py-3 ${showBorder ? "border-b border-gray-100" : ""}`}
    >
      <View className="w-8 h-8 rounded-full bg-[#F0F2F5] items-center justify-center mr-3">
        <Ionicons name={icon} size={17} color="#6D7683" />
      </View>
      <View className="flex-1">
        <Text className="text-[13px] font-bold text-[#2D2D2D]">{label}</Text>
        {description ? (
          <Text className="text-[10px] text-[#8B95A4] mt-0.5">{description}</Text>
        ) : null}
      </View>
      {value ? (
        <Text className="text-sm text-[#9BA5B7] mr-2">{value}</Text>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color="#C5CAD3" />
    </TouchableOpacity>
  );
}
