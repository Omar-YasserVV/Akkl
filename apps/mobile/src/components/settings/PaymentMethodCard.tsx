import { PaymentMethod } from "@/types/payment";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

function getPaymentIcon(type: PaymentMethod["type"]): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case "apple_pay":
      return "logo-apple";
    case "google_pay":
      return "logo-google";
    case "vodafone_cash":
      return "phone-portrait-outline";
    case "cash_on_delivery":
      return "cash-outline";
    default:
      return "card-outline";
  }
}

type PaymentMethodCardProps = {
  method: PaymentMethod;
  onDetails?: () => void;
  onRemove?: () => void;
  onSetDefault?: () => void;
};

export function PaymentMethodCard({
  method,
  onDetails,
  onRemove,
  onSetDefault,
}: PaymentMethodCardProps) {
  return (
    <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-3">
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 rounded-xl bg-[#E3F2FD] items-center justify-center mr-3">
          <Ionicons name={getPaymentIcon(method.type)} size={22} color="#1565C0" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-[#2D2D2D]">{method.label}</Text>
          {method.isDefault ? (
            <Text className="text-xs font-semibold text-primary mt-0.5">Default</Text>
          ) : null}
        </View>
      </View>
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={onDetails}
          className="flex-1 border border-gray-200 rounded-xl py-2.5 items-center"
        >
          <Text className="text-sm font-medium text-[#2D2D2D]">Details</Text>
        </TouchableOpacity>
        {method.isDefault ? (
          <TouchableOpacity
            onPress={onRemove}
            className="flex-1 border border-red-200 rounded-xl py-2.5 items-center"
          >
            <Text className="text-sm font-medium text-red-500">Remove</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onSetDefault}
            className="flex-1 bg-primary/10 rounded-xl py-2.5 items-center"
          >
            <Text className="text-sm font-medium text-primary">Set as Default</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
