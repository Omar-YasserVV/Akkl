import { QrScannerView } from "@/components/dine-in/qr-scanner-view";
import { DINE_IN_BRANCH, parseTableQr } from "@/constants/dine-in";
import { useCart } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DineInScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setDineInSession } = useCart();
  const [scanned, setScanned] = useState(false);

  const handleTableDetected = useCallback(
    (tableNumber: string) => {
      if (scanned) return;
      setScanned(true);
      setDineInSession({
        ...DINE_IN_BRANCH,
        tableNumber,
      });
      router.replace("/dine-in/menu" as Href);
    },
    [router, scanned, setDineInSession],
  );

  const simulateScan = () => handleTableDetected("5");

  const handleManualEntry = () => {
    const tableNumber = parseTableQr("table:5");
    if (tableNumber) handleTableDetected(tableNumber);
  };

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="px-7 pb-5 bg-[#F7F8FA]"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.85}
            className="flex-row items-center flex-1"
          >
            <Ionicons name="location-sharp" size={28} color="#065FCC" />
            <Text
              className="ml-3 text-[26px] font-bold text-[#065FCC]"
              numberOfLines={1}
            >
              Downtown Branch
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color="#7B8495"
              style={{ marginLeft: 8, marginTop: 2 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            activeOpacity={0.85}
          >
            <Ionicons name="person-circle-outline" size={34} color="#424957" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 mx-5 mb-5 rounded-[12px] overflow-hidden bg-[#1A1A1A]">
        <QrScannerView />

        <View
          className="absolute bottom-0 left-0 right-0 px-6 pb-6"
          style={{ zIndex: 2 }}
        >
          <TouchableOpacity
            onPress={simulateScan}
            activeOpacity={0.88}
            className="h-[56px] rounded-[8px] bg-white items-center justify-center mb-3"
          >
            <Text className="text-[17px] font-bold text-[#065FCC]">
              Demo: Use Table #5
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleManualEntry}
            activeOpacity={0.88}
            className="h-[56px] rounded-[8px] border border-white/40 bg-white/10 items-center justify-center flex-row"
          >
            <Ionicons name="calendar-outline" size={22} color="#FFFFFF" />
            <Text className="ml-3 text-[17px] font-semibold text-white">
              Book a Table
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
