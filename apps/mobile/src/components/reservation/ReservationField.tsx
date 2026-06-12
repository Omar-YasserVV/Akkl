import React from "react";
import { Text, TextInput, View } from "react-native";

interface ReservationFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad" | "numeric";
  onChangeText: (text: string) => void;
  error?: string;
  multiline?: boolean;
}

export function ReservationField({
  label,
  value,
  placeholder,
  keyboardType = "default",
  onChangeText,
  error,
  multiline = false,
}: ReservationFieldProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-[14px] font-semibold text-[#1C2026]">
        {label}
      </Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        multiline={multiline}
        className="rounded-[14px] border border-[#D1D5DB] bg-white px-4 py-3 text-[15px] text-[#252B33]"
      />
      {error ? (
        <Text className="mt-1 text-[12px] text-[#D14343]">{error}</Text>
      ) : null}
    </View>
  );
}
