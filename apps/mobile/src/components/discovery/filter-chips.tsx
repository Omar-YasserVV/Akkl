import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

interface FilterChip {
  id: string;
  label: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function FilterChips({ chips, selectedId, onSelect }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
    >
      {chips.map((chip) => {
        const isSelected = chip.id === selectedId;
        return (
          <TouchableOpacity
            key={chip.id}
            onPress={() => onSelect(chip.id)}
            className={`px-4 py-2 rounded-full ${
              isSelected ? "bg-primary" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isSelected ? "text-white" : "text-[#2D2D2D]"
              }`}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
