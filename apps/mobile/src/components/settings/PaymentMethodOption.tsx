import { PaymentMethodType } from "@/types/payment";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type PaymentMethodOptionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  showBorder?: boolean;
};

export function PaymentMethodOption({
  icon,
  title,
  description,
  onPress,
  showBorder = true,
}: PaymentMethodOptionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center px-4 py-4 ${showBorder ? "border-b border-gray-100" : ""}`}
    >
      <View className="w-10 h-10 rounded-xl bg-[#E3F2FD] items-center justify-center mr-3">
        <Ionicons name={icon} size={20} color="#1565C0" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-[#2D2D2D]">{title}</Text>
        <Text className="text-xs text-[#9BA5B7] mt-0.5">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#C5CAD3" />
    </TouchableOpacity>
  );
}

export const WALLET_OPTIONS = [
  {
    type: "apple_pay" as PaymentMethodType,
    label: "Apple Pay",
    description: "Pay quickly with Apple Pay",
    icon: "logo-apple" as const,
  },
  {
    type: "google_pay" as PaymentMethodType,
    label: "Google Pay",
    description: "Pay with your Google account",
    icon: "logo-google" as const,
  },
  {
    type: "visa" as PaymentMethodType,
    label: "Visa / Mastercard",
    description: "Add a credit or debit card",
    icon: "card-outline" as const,
  },
  {
    type: "vodafone_cash" as PaymentMethodType,
    label: "Vodafone Cash",
    description: "Pay with mobile wallet",
    icon: "phone-portrait-outline" as const,
  },
];
