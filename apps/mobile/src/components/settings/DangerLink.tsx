import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type DangerLinkProps = TouchableOpacityProps & {
  label: string;
};

export function DangerLink({ label, ...props }: DangerLinkProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} className="items-center py-3" {...props}>
      <Text className="text-sm font-semibold text-red-500">{label}</Text>
    </TouchableOpacity>
  );
}
