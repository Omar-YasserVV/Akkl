import { QuantityStepper } from "@/components/discovery/quantity-stepper";
import { useCart } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const formatPrice = (price: number) => `${price.toFixed(2)} LE`;

export default function PickupCartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    items,
    subtotal,
    updateItemQuantity,
    removeItem,
    branchName,
    itemCount,
  } = useCart();

  const serviceFee = 2.50; // Fixed Service Fee matching design
  const tax = subtotal * 0.08; // 8% Tax rate
  const totalWithTax = subtotal > 0 ? subtotal + serviceFee + tax : 0;

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white px-5 pb-4 border-b border-[#E8EBF0] flex-row items-center"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-[18px] font-bold text-[#1A1A1A] text-center" numberOfLines={1}>
            {branchName || "Downtown Branch"}
          </Text>
        </View>
        <TouchableOpacity style={{ opacity: 0 }} disabled className="p-1">
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-end justify-between mt-5 mb-5">
          <Text className="text-[32px] font-extrabold text-[#171B20]">
            Your Cart
          </Text>
          <Text className="text-[17px] font-semibold text-[#6E7682] mb-1.5">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Text>
        </View>

        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="cart-outline" size={80} color="#BEC8DA" />
            <Text className="mt-4 text-[18px] font-bold text-[#6E7682]">
              Your cart is empty
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="mt-4 px-6 py-3 bg-[#065FCC] rounded-[10px]"
            >
              <Text className="text-white font-bold text-[15px]">Go Back to Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {items.map((line) => (
              <View
                key={`${line.itemId}-${line.variationId ?? "base"}`}
                className="bg-white rounded-[12px] border border-[#E8EBF0] p-4 mb-3 flex-row position-relative"
              >
                {/* Product image */}
                <View className="w-[84px] h-[84px] rounded-[10px] overflow-hidden bg-[#F2F3F5] mr-4">
                  <Image
                    source={{
                      uri:
                        line.image ??
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                    }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                </View>

                {/* Info and quantity */}
                <View className="flex-1 justify-between py-0.5">
                  <View className="pr-6">
                    <Text
                      className="text-[17px] font-bold text-[#1A1A1A]"
                      numberOfLines={1}
                    >
                      {line.name}
                    </Text>
                    {line.variationLabel ? (
                      <Text className="text-[13px] font-medium text-[#6E7682] mt-0.5">
                        Size: {line.variationLabel}
                      </Text>
                    ) : null}
                    <Text className="text-[15px] font-bold text-[#065FCC] mt-1">
                      {formatPrice(line.unitPrice)}
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-2">
                    <QuantityStepper
                      value={line.quantity}
                      onChange={(quantity) =>
                        updateItemQuantity(line.itemId, quantity, line.variationId)
                      }
                    />
                  </View>
                </View>

                {/* Remove 'x' button */}
                <TouchableOpacity
                  onPress={() => removeItem(line.itemId, line.variationId)}
                  className="absolute top-3 right-3 p-1"
                >
                  <Ionicons name="close" size={20} color="#858C9B" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Price breakdown */}
            <View className="bg-white rounded-[12px] border border-[#E8EBF0] p-5 mt-4">
              <Text className="text-[18px] font-bold text-[#171B20] mb-4">
                Order Summary
              </Text>
              <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
              <SummaryRow label="Service Fee" value={formatPrice(serviceFee)} />
              <SummaryRow label="Tax (8%)" value={formatPrice(tax)} />
              <View className="h-px bg-[#E8EBF0] my-3" />
              <View className="flex-row items-center justify-between">
                <Text className="text-[18px] font-extrabold text-[#171B20]">
                  Total
                </Text>
                <Text className="text-[20px] font-extrabold text-[#065FCC]">
                  {formatPrice(totalWithTax)}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {items.length > 0 && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8EBF0] px-5 pt-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <TouchableOpacity
            onPress={() => router.push("/pickup/checkout" as Href)}
            activeOpacity={0.9}
            className="h-[56px] rounded-[12px] bg-[#065FCC] flex-row items-center justify-center gap-2"
          >
            <Text className="text-[17px] font-bold text-white">
              Go to Checkout
            </Text>
            <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between mb-2.5">
      <Text className="text-[15px] text-[#5A6270] font-medium">{label}</Text>
      <Text className="text-[15px] font-semibold text-[#1A1A1A]">{value}</Text>
    </View>
  );
}
