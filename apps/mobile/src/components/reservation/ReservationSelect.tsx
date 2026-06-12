import type { ChoiceOption } from "@/types/reservation";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ReservationSelectProps<T extends string | number> {
  label: string;
  options: ChoiceOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  error?: string;
}

export function ReservationSelect<T extends string | number>({
  label,
  options,
  selectedValue,
  onSelect,
  error,
}: ReservationSelectProps<T>) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-[14px] font-semibold text-[#1C2026]">
        {label}
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.value === selectedValue;
          return (
            <TouchableOpacity
              key={`${option.value}`}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.8}
              className={`rounded-[12px] border px-4 py-3 ${
                isSelected
                  ? "border-[#0057C0] bg-[#E7F2FF]"
                  : "border-[#D1D5DB] bg-white"
              }`}
            >
              <Text
                className={`text-[14px] font-medium ${
                  isSelected ? "text-[#0057C0]" : "text-[#3B4253]"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? (
        <Text className="mt-1 text-[12px] text-[#D14343]">{error}</Text>
      ) : null}
    </View>
  );
}
