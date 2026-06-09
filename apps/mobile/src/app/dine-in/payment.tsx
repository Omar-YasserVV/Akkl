import { TableHeader } from "@/components/dine-in/table-header";
import { formatPrice } from "@/constants/dine-in";
import { useCart } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PaymentMethod = "apple_pay" | "credit_card" | "pay_at_counter";

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: "apple_pay",
    title: "Apple Pay",
    subtitle: "Fast & Secure",
    icon: "logo-apple",
  },
  {
    id: "credit_card",
    title: "Credit Card",
    subtitle: "Visa ending in **** 4242",
    icon: "card-outline",
  },
  {
    id: "pay_at_counter",
    title: "Pay at Counter",
    subtitle: "Cash or Physical Terminal",
    icon: "cash-outline",
  },
];

export default function DineInPaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { total, placeOrder, items } = useCart();
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>("apple_pay");

  const handlePlaceOrder = () => {
    const label =
      PAYMENT_OPTIONS.find((option) => option.id === selectedMethod)?.title ??
      "Payment";
    placeOrder(label);
    router.replace("/dine-in/order-status" as Href);
  };

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <View style={{ paddingTop: insets.top }}>
        <TableHeader showBranch={false} />
      </View>

      <View className="bg-white px-5 py-4 border-b border-[#E8EBF0] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-[24px] font-extrabold text-[#171B20]">
          Payment
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSelectedMethod(option.id)}
              activeOpacity={0.9}
              className={`mb-3 rounded-[12px] border p-4 flex-row items-center ${
                isSelected
                  ? "border-[#065FCC] bg-[#EBF2FF]"
                  : "border-[#E8EBF0] bg-white"
              }`}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  isSelected ? "bg-[#065FCC]" : "bg-[#F2F3F5]"
                }`}
              >
                <Ionicons
                  name={option.icon}
                  size={24}
                  color={isSelected ? "#FFFFFF" : "#424957"}
                />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-[17px] font-bold text-[#1A1A1A]">
                  {option.title}
                </Text>
                <Text className="text-[14px] text-[#5A6270] mt-0.5">
                  {option.subtitle}
                </Text>
              </View>
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                  isSelected ? "border-[#065FCC]" : "border-[#C5CAD3]"
                }`}
              >
                {isSelected ? (
                  <View className="w-2.5 h-2.5 rounded-full bg-[#065FCC]" />
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8EBF0] px-5 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={items.length === 0}
          activeOpacity={0.9}
          className={`h-[56px] rounded-[12px] items-center justify-center ${
            items.length === 0 ? "bg-[#B0B8C4]" : "bg-[#065FCC]"
          }`}
        >
          <Text className="text-[17px] font-bold text-white">
            Confirm & Place Order | {formatPrice(total)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
