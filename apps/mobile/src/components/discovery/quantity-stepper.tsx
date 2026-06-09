import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
}: QuantityStepperProps) {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1">
      <TouchableOpacity
        onPress={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 items-center justify-center"
      >
        <Ionicons name="remove" size={18} color="#2D2D2D" />
      </TouchableOpacity>
      <Text className="w-8 text-center font-semibold text-[#2D2D2D]">
        {value}
      </Text>
      <TouchableOpacity
        onPress={() => onChange(value + 1)}
        className="w-8 h-8 items-center justify-center"
      >
        <Ionicons name="add" size={18} color="#2D2D2D" />
      </TouchableOpacity>
    </View>
  );
}
