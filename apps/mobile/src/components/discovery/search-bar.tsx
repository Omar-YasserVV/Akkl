import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  editable?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  placeholder = "Search restaurants, dishes, cuisines...",
  onChangeText,
  onPress,
  editable = true,
  autoFocus,
}: SearchBarProps) {
  const content = (
    <View className="flex-row items-center bg-gray-100 rounded-full px-4 h-12">
      <Ionicons name="search" size={20} color="#1565C0" />
      <TextInput
        className="flex-1 ml-3 text-base text-[#2D2D2D]"
        placeholder={placeholder}
        placeholderTextColor="#9BA5B7"
        value={value}
        onChangeText={onChangeText}
        editable={editable && !onPress}
        autoFocus={autoFocus}
        pointerEvents={onPress ? "none" : "auto"}
      />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
