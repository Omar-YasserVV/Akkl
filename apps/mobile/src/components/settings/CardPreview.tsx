import React from "react";
import { Text, View } from "react-native";

type CardPreviewProps = {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
};

export function CardPreview({
  cardholderName,
  cardNumber,
  expiryDate,
}: CardPreviewProps) {
  const displayNumber = cardNumber.trim()
    ? cardNumber.padEnd(19, "•").replace(/(.{4})/g, "$1 ").trim()
    : "•••• •••• •••• ••••";

  return (
    <View className="bg-primary rounded-2xl p-5 mb-6 min-h-[180px] justify-between">
      <Text className="text-white/80 text-sm">Credit Card</Text>
      <Text className="text-white text-xl font-semibold tracking-widest">
        {displayNumber}
      </Text>
      <View className="flex-row justify-between items-end">
        <View>
          <Text className="text-white/70 text-xs mb-1">Cardholder</Text>
          <Text className="text-white font-medium">
            {cardholderName || "YOUR NAME"}
          </Text>
        </View>
        <View>
          <Text className="text-white/70 text-xs mb-1">Expires</Text>
          <Text className="text-white font-medium">{expiryDate || "MM/YY"}</Text>
        </View>
      </View>
    </View>
  );
}
