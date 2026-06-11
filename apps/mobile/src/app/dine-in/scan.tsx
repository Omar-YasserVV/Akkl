import { QrScannerView } from "@/components/dine-in/qr-scanner-view";
import { DINE_IN_BRANCH, parseTableQr } from "@/constants/dine-in";
import { useCart } from "@/context/cart-context";
import { useSession } from "@/context/session-context";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DineInScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { restaurant, branch } = useSession();
  const { setDineInSession } = useCart();
  const [scanned, setScanned] = useState(false);

  const handleTableDetected = useCallback(
    (tableNumber: string) => {
      if (scanned) return;
      setScanned(true);
      setDineInSession({
        branchId: branch?.id ?? DINE_IN_BRANCH.branchId,
        restaurantId: restaurant?.id ?? DINE_IN_BRANCH.restaurantId,
        restaurantName: restaurant?.name ?? DINE_IN_BRANCH.restaurantName,
        branchName: branch?.name ?? DINE_IN_BRANCH.branchName,
        tableNumber,
      });
      router.replace("/dine-in/menu" as Href);
    },
    [branch, restaurant, router, scanned, setDineInSession],
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
            className="flex-row items-center gap-1 flex-1"
          >
            <Ionicons
              name="location-sharp"
              size={22}
              className="text-[#0057C0]"
            />
            <Text
              className="text-[22px] font-bold text-[#0057C0]"
              numberOfLines={1}
            >
              Downtown Branch
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color="#7B8495"
              style={{ marginTop: 2 }}
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
        {/* Camera + overlay */}
        <QrScannerView
          onScan={(data) => {
            const tableNumber = parseTableQr(data);
            if (tableNumber) handleTableDetected(tableNumber);
          }}
        />

        {/* Buttons sit OUTSIDE the camera but inside the dark card */}
        <View className="px-6 pb-6 pt-3 bg-[#1A1A1A]">
          <TouchableOpacity
            onPress={simulateScan}
            activeOpacity={0.88}
            className="h-[56px] rounded-[8px] bg-white items-center justify-center mb-3"
          >
            <Text className="text-[17px] font-bold text-[#0057C0]">
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
