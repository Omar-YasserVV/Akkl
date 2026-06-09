import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface QrScannerViewProps {
  message?: string;
}

export function QrScannerView({
  message = "Align the QR code within the frame to start your order",
}: QrScannerViewProps) {
  return (
    <View className="flex-1 bg-[#0D0D0D] items-center justify-center">
      <View className="absolute inset-0 opacity-20">
        <View className="flex-1 bg-[#1A2332]" />
      </View>
      <Ionicons
        name="scan-outline"
        size={48}
        color="#FFFFFF"
        style={{ opacity: 0.15, position: "absolute" }}
      />
      <View className="items-center px-8 mb-48" style={{ zIndex: 1 }}>
        <Text className="text-[28px] font-extrabold text-white mb-2">
          Scan Table QR
        </Text>
        <Text className="text-center text-[16px] text-white/75 leading-6">
          {message}
        </Text>
      </View>
      <View
        className="w-[220px] h-[220px] border-2 border-white rounded-[8px]"
        style={{ zIndex: 1 }}
      />
    </View>
  );
}
