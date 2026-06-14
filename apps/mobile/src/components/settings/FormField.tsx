import React from "react";
import { Text, TextInput, View } from "react-native";

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  secureTextEntry?: boolean;
  editable?: boolean;
  rightElement?: React.ReactNode;
};

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  editable = true,
  rightElement,
}: FormFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-[12px] font-bold text-[#414852] mb-2">{label}</Text>
      <View className="flex-row items-center bg-white border border-[#DDE2EA] rounded-lg px-4">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          className="flex-1 py-3.5 text-[14px] text-[#2D2D2D]"
          placeholderTextColor="#9BA5B7"
        />
        {rightElement}
      </View>
    </View>
  );
}
