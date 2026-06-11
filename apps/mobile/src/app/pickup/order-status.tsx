import { useCart } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const formatPrice = (price: number) => `${price.toFixed(2)} LE`;

export default function PickupOrderStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lastOrder, items, subtotal, branchName, clearCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);
  const [stage, setStage] = useState<"confirmed" | "preparing" | "ready">(
    "preparing",
  );
  const [countdown, setCountdown] = useState(12);

  // Simulation: Countdown timer and status update
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setStage("ready");
          return 0;
        }
        return prev - 1;
      });
    }, 5000); // Speed up the simulation for demo purposes

    return () => clearInterval(timer);
  }, []);

  const orderId = lastOrder?.id ?? "#ORD-9921";
  const paymentMethod = lastOrder?.paymentMethod ?? "Apple Pay";
  const placedAt = lastOrder?.placedAt ?? new Date();

  const serviceFee = 2.5;
  const tax = subtotal * 0.08;
  const totalWithTax = subtotal > 0 ? subtotal + serviceFee + tax : 29.84; // Fallback total matching design

  const toggleDetails = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDetails(!showDetails);
  };

  const handleReturnHome = () => {
    clearCart();
    router.replace("/(tabs)");
  };

  const branchAddress =
    branchName === "Uptown Hub"
      ? "42 Garden Street, Uptown"
      : branchName === "East Side Kitchen"
        ? "88 Market Road, East Side"
        : "Smart Dining HQ, 5th Ave";

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white px-5 pb-4 border-b border-[#E8EBF0] flex-row items-center justify-between"
      >
        <TouchableOpacity onPress={handleReturnHome} className="p-1">
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-[#1A1A1A]">
          {branchName || "Smart Restaurant"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1: Preparing Status */}
        <View className="bg-white rounded-[16px] border border-[#E8EBF0] p-5 items-center mb-4">
          <Text className="text-[12px] font-bold text-[#065FCC] uppercase tracking-wider">
            Order Status
          </Text>
          <Text className="text-[24px] font-extrabold text-[#171B20] mt-1.5 text-center">
            {stage === "ready" ? "Your order is ready!" : "Preparing your meal"}
          </Text>
          {stage !== "ready" ? (
            <Text className="text-[14px] font-semibold text-[#5A6270] mt-1 text-center">
              Estimated pick-up in{" "}
              <Text className="text-[#065FCC]">{countdown} mins</Text>
            </Text>
          ) : (
            <Text className="text-[14px] font-semibold text-[#128A4D] mt-1 text-center">
              Pick up at the counter
            </Text>
          )}
        </View>

        {/* Card 2: Progress Timeline */}
        <View className="bg-white rounded-[16px] border border-[#E8EBF0] p-5 mb-4">
          <View className="flex-row items-center justify-between px-3">
            {/* Confirmed Stage */}
            <View className="items-center">
              <View className="w-8 h-8 rounded-full bg-[#128A4D] items-center justify-center">
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
              <Text className="text-[11px] font-bold text-[#128A4D] mt-2">
                Confirmed
              </Text>
            </View>

            {/* Line 1 */}
            <View className="flex-1 h-0.5 bg-[#065FCC] mx-2 mb-4" />

            {/* Preparing Stage */}
            <View className="items-center">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  stage === "preparing" ? "bg-[#065FCC]" : "bg-[#128A4D]"
                }`}
              >
                {stage === "preparing" ? (
                  <Ionicons name="restaurant" size={16} color="#FFFFFF" />
                ) : (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text
                className={`text-[11px] font-bold mt-2 ${
                  stage === "preparing" ? "text-[#065FCC]" : "text-[#128A4D]"
                }`}
              >
                Preparing
              </Text>
            </View>

            {/* Line 2 */}
            <View
              className={`flex-1 h-0.5 mx-2 mb-4 ${
                stage === "ready" ? "bg-[#065FCC]" : "bg-[#E8EBF0]"
              }`}
            />

            {/* Ready Stage */}
            <View className="items-center">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  stage === "ready" ? "bg-[#065FCC]" : "bg-[#E8EBF0]"
                }`}
              >
                <Ionicons
                  name="gift-outline"
                  size={16}
                  color={stage === "ready" ? "#FFFFFF" : "#BEC8DA"}
                />
              </View>
              <Text
                className={`text-[11px] font-bold mt-2 ${
                  stage === "ready" ? "text-[#065FCC]" : "text-[#BEC8DA]"
                }`}
              >
                Ready
              </Text>
            </View>
          </View>
        </View>

        {/* Card 3: QR Verification Code */}
        <View className="bg-white rounded-[16px] border border-[#E8EBF0] p-6 items-center mb-4">
          <Text className="text-[14px] font-bold text-[#6E7682] mb-4 text-center">
            Show this code at pick-up counter
          </Text>

          {/* Stylized custom vector QR Code to guarantee high performance and beautiful render */}
          <View className="p-3 bg-white border border-[#E8EBF0] rounded-[12px]">
            <QrCodeMockup />
          </View>

          <Text className="text-[20px] font-extrabold text-[#171B20] mt-4 tracking-widest">
            {orderId}
          </Text>
        </View>

        {/* Card 4: Restaurant details & expander */}
        <View className="bg-white rounded-[16px] border border-[#E8EBF0] overflow-hidden mb-6">
          <View className="p-4 flex-row items-center justify-between border-b border-[#F4F6F9]">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-12 h-12 rounded-[10px] bg-[#065FCC]/10 items-center justify-center mr-3">
                <Ionicons name="restaurant" size={22} color="#065FCC" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-[16px] font-bold text-[#171B20]"
                  numberOfLines={1}
                >
                  {branchName || "Downtown Branch"}
                </Text>
                <Text
                  className="text-[13px] font-medium text-[#6E7682] mt-0.5"
                  numberOfLines={1}
                >
                  {branchAddress}
                </Text>
              </View>
            </View>

            <TouchableOpacity className="bg-[#EBF2FF] px-4 py-2 rounded-[8px] flex-row items-center">
              <Text className="text-[13px] font-extrabold text-[#065FCC]">
                Directions
              </Text>
            </TouchableOpacity>
          </View>

          {/* Accordion Trigger */}
          <TouchableOpacity
            onPress={toggleDetails}
            activeOpacity={0.8}
            className="px-4 py-3 flex-row items-center justify-between bg-[#FCFDFE]"
          >
            <Text className="text-[14px] font-bold text-[#424957]">
              Order Details
            </Text>
            <Ionicons
              name={showDetails ? "chevron-up" : "chevron-down"}
              size={18}
              color="#6E7682"
            />
          </TouchableOpacity>

          {/* Accordion Content */}
          {showDetails && (
            <View className="px-4 pb-4 pt-1 bg-[#FCFDFE]">
              {items.length > 0 ? (
                items.map((line, idx) => (
                  <View
                    key={line.itemId + idx}
                    className="flex-row justify-between mb-2"
                  >
                    <Text className="text-[14px] text-[#5A6270] flex-1">
                      {line.quantity}x {line.name}
                    </Text>
                    <Text className="text-[14px] font-semibold text-[#171B20]">
                      {formatPrice(line.unitPrice * line.quantity)}
                    </Text>
                  </View>
                ))
              ) : (
                <View className="flex-row justify-between mb-2">
                  <Text className="text-[14px] text-[#5A6270] flex-1">
                    1x Signature Wagyu Burger
                  </Text>
                  <Text className="text-[14px] font-semibold text-[#171B20]">
                    23.50 LE
                  </Text>
                </View>
              )}
              <View className="h-px bg-[#E8EBF0] my-2" />
              <View className="flex-row justify-between mb-1">
                <Text className="text-[13px] text-[#858C9B]">
                  Payment Method
                </Text>
                <Text className="text-[13px] font-medium text-[#424957]">
                  {paymentMethod}
                </Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-[13px] text-[#858C9B]">Subtotal</Text>
                <Text className="text-[13px] font-medium text-[#424957]">
                  {formatPrice(subtotal || 23.5)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-[13px] text-[#858C9B]">Tax & Fees</Text>
                <Text className="text-[13px] font-medium text-[#424957]">
                  {formatPrice(tax + serviceFee)}
                </Text>
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-[14px] font-bold text-[#171B20]">
                  Total Paid
                </Text>
                <Text className="text-[14px] font-extrabold text-[#065FCC]">
                  {formatPrice(totalWithTax)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Back to Home Button */}
        <TouchableOpacity
          onPress={handleReturnHome}
          activeOpacity={0.9}
          className="h-[56px] rounded-[12px] bg-[#065FCC] items-center justify-center shadow-md shadow-blue-500/25 mt-2"
        >
          <Text className="text-[17px] font-bold text-white">Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Stylized vector QR Code component
function QrCodeMockup() {
  const grid = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
    [1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
  ];

  return (
    <View
      style={{
        width: 140,
        height: 140,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {grid.map((row, rIdx) => (
        <View key={rIdx} className="flex-row">
          {row.map((cell, cIdx) => (
            <View
              key={cIdx}
              style={{
                width: 7,
                height: 7,
                backgroundColor: cell === 1 ? "#171B20" : "transparent",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
