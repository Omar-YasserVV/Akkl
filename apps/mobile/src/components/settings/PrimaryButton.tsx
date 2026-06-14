import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type PrimaryButtonProps = TouchableOpacityProps & {
  label: string;
  loading?: boolean;
  variant?: "primary" | "danger";
};

export function PrimaryButton({
  label,
  loading = false,
  disabled,
  variant = "primary",
  className,
  ...props
}: PrimaryButtonProps) {
  const bgClass = variant === "danger" ? "bg-[#D01818]" : "bg-[#0066D9]";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      className={`${bgClass} rounded-xl py-4 items-center shadow-sm ${disabled || loading ? "opacity-60" : ""} ${className ?? ""}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-[15px] font-extrabold text-white">{label}</Text>
      )}
    </TouchableOpacity>
  );
}
