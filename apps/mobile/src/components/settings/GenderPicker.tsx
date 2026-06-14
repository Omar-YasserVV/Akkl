import { GENDER_OPTIONS } from "@/stores/profile-store";
import { Gender } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type GenderPickerProps = {
  value: Gender;
  onChange: (gender: Gender) => void;
};

export function GenderPicker({ value, onChange }: GenderPickerProps) {
  const currentLabel =
    GENDER_OPTIONS.find((option) => option.value === value)?.label ?? "Select";

  const handlePress = () => {
    const currentIndex = GENDER_OPTIONS.findIndex(
      (option) => option.value === value,
    );
    const nextIndex = (currentIndex + 1) % GENDER_OPTIONS.length;
    onChange(GENDER_OPTIONS[nextIndex].value);
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-[#2D2D2D] mb-2">Gender</Text>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5"
      >
        <Text className="flex-1 text-base text-[#2D2D2D]">{currentLabel}</Text>
        <Ionicons name="chevron-down" size={18} color="#9BA5B7" />
      </TouchableOpacity>
    </View>
  );
}
