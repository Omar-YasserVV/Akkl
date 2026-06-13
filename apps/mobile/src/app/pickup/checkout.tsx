import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useCreateOrder } from "@/orders/hooks/Orders";
import { buildCreateOrderPayload } from "@/orders/utils/buildCreateOrderPayload";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PaymentMethod = "apple_pay" | "credit_card";

const formatPrice = (price: number) => `${price.toFixed(2)} LE`;

export default function PickupCheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { items, subtotal, placeOrder, branchName } = useCart();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("apple_pay");

  const handlePlaceOrder = () => {
    if (!user || items.length === 0) return;

    const methodLabel =
      paymentMethod === "apple_pay" ? "Apple Pay" : "Visa **** 4242";

    createOrder(buildCreateOrderPayload(items, user), {
      onSuccess: (order) => {
        placeOrder(methodLabel, {
          id: order.id,
          orderNumber: order.orderNumber,
          total: parseFloat(order.totalPrice),
        });
        router.replace("/pickup/order-status" as Href);
      },
      onError: () => {
        Alert.alert(
          "Order failed",
          "Could not place your order. Please try again.",
        );
      },
    });
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
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-[#1A1A1A]">Checkout</Text>
        <TouchableOpacity className="p-1">
          <Ionicons name="help-circle-outline" size={24} color="#6E7682" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Pick-up Location */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-[17px] font-bold text-[#171B20] uppercase tracking-wider">
            Pick-up Location
          </Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/select-branch",
                params: { change: "true" },
              })
            }
          >
            <Text className="text-[13px] font-extrabold text-[#065FCC]">
              CHANGE
            </Text>
          </TouchableOpacity>
        </View>

        {/* Map Card */}
        <View className="mb-4 rounded-[12px] overflow-hidden bg-white border border-[#E8EBF0]">
          {/* Map drawing mockup */}
          <View className="h-[120px] bg-[#B8D7D9] relative items-center justify-center">
            {/* Simple schematic shapes to resemble a map */}
            <View className="absolute left-6 top-4 h-16 w-8 rotate-12 bg-white/35" />
            <View className="absolute right-12 top-2 h-24 w-12 -rotate-12 bg-white/25" />
            <View className="absolute left-0 top-14 h-4 w-full bg-white/30" />
            <View className="w-8 h-8 rounded-full bg-[#065FCC] items-center justify-center shadow-lg">
              <Ionicons name="location-sharp" size={18} color="#FFFFFF" />
            </View>
          </View>
          <View className="p-4 flex-row items-center border-t border-[#E8EBF0]">
            <Ionicons name="location-outline" size={18} color="#065FCC" />
            <Text className="ml-2 text-[14px] font-bold text-[#424957]">
              {branchAddress}
            </Text>
          </View>
        </View>

        {/* Ready time estimate */}
        <View className="bg-white rounded-[12px] border border-[#E8EBF0] p-4 flex-row items-center mb-6">
          <View className="w-10 h-10 rounded-full bg-[#EBF2FF] items-center justify-center">
            <Ionicons name="time-outline" size={20} color="#065FCC" />
          </View>
          <View className="ml-4">
            <Text className="text-[11px] font-bold text-[#858C9B] uppercase tracking-wider">
              Estimated Ready Time
            </Text>
            <Text className="text-[16px] font-extrabold text-[#171B20] mt-0.5">
              15 - 20 mins
            </Text>
          </View>
        </View>

        {/* Section 2: Order Summary */}
        <Text className="text-[17px] font-bold text-[#171B20] uppercase tracking-wider mb-3">
          Order Summary
        </Text>
        <View className="bg-white rounded-[12px] border border-[#E8EBF0] p-4 mb-6">
          {items.map((line, idx) => (
            <View
              key={line.itemId + idx}
              className="flex-row items-center mb-3"
            >
              <Image
                source={{
                  uri:
                    line.image ??
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                }}
                style={{ width: 48, height: 48, borderRadius: 8 }}
                contentFit="cover"
              />
              <View className="flex-1 ml-3 pr-2">
                <Text
                  className="text-[15px] font-bold text-[#171B20]"
                  numberOfLines={1}
                >
                  {line.name}
                </Text>
                <Text className="text-[13px] font-medium text-[#6E7682] mt-0.5">
                  Qty: {line.quantity}{" "}
                  {line.variationLabel ? `· Size: ${line.variationLabel}` : ""}
                </Text>
              </View>
              <Text className="text-[15px] font-bold text-[#171B20]">
                {formatPrice(line.unitPrice * line.quantity)}
              </Text>
            </View>
          ))}
          <View className="h-px bg-[#E8EBF0] my-2" />
          <View className="flex-row justify-between mt-1">
            <Text className="text-[16px] font-extrabold text-[#171B20]">
              Total
            </Text>
            <Text className="text-[16px] font-extrabold text-[#065FCC]">
              {formatPrice(subtotal)}
            </Text>
          </View>
        </View>

        {/* Section 3: Payment Method */}
        <Text className="text-[17px] font-bold text-[#171B20] uppercase tracking-wider mb-3">
          Payment Method
        </Text>

        {/* Apple Pay Row */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("apple_pay")}
          activeOpacity={0.88}
          className={`bg-white rounded-[12px] border p-4 flex-row items-center mb-3 ${
            paymentMethod === "apple_pay"
              ? "border-[#065FCC]"
              : "border-[#E8EBF0]"
          }`}
        >
          <View className="w-10 h-10 rounded-full bg-[#EBF2FF] items-center justify-center">
            <Ionicons name="logo-apple" size={20} color="#065FCC" />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-[15px] font-bold text-[#171B20]">
              Apple Pay
            </Text>
          </View>
          <View
            className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
              paymentMethod === "apple_pay"
                ? "border-[#065FCC]"
                : "border-[#BEC8DA]"
            }`}
          >
            {paymentMethod === "apple_pay" && (
              <View className="w-2.5 h-2.5 rounded-full bg-[#065FCC]" />
            )}
          </View>
        </TouchableOpacity>

        {/* Credit Card Row */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("credit_card")}
          activeOpacity={0.88}
          className={`bg-white rounded-[12px] border p-4 flex-row items-center mb-6 ${
            paymentMethod === "credit_card"
              ? "border-[#065FCC]"
              : "border-[#E8EBF0]"
          }`}
        >
          <View className="w-10 h-10 rounded-full bg-[#F2F3F5] items-center justify-center">
            <Ionicons name="card-outline" size={20} color="#6E7682" />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-[15px] font-bold text-[#171B20]">
              Visa •••• 4242
            </Text>
          </View>
          <View
            className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
              paymentMethod === "credit_card"
                ? "border-[#065FCC]"
                : "border-[#BEC8DA]"
            }`}
          >
            {paymentMethod === "credit_card" && (
              <View className="w-2.5 h-2.5 rounded-full bg-[#065FCC]" />
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Place Order Bottom Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8EBF0] px-5 pt-4 flex-row items-center justify-between"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View>
          <Text className="text-[12px] font-bold text-[#858C9B] uppercase tracking-wider">
            Amount to Pay
          </Text>
          <View className="flex-row items-center mt-0.5">
            <Text className="text-[18px] font-extrabold text-[#171B20] mr-2">
              {formatPrice(subtotal)}
            </Text>
            <View className="bg-[#E2F7EB] rounded-full px-2 py-0.5 flex-row items-center">
              <Ionicons name="lock-closed" size={10} color="#128A4D" />
              <Text className="ml-1 text-[9px] font-bold text-[#128A4D]">
                Secure
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={items.length === 0 || isPending}
          activeOpacity={0.9}
          className={`h-[48px] rounded-[10px] bg-[#065FCC] px-6 items-center justify-center flex-row ${
            items.length === 0 || isPending ? "opacity-50" : ""
          }`}
        >
          {isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-[15px] font-extrabold text-white">
              Place Pick-Up Order
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
