import { TableHeader } from "@/components/dine-in/table-header";
import { QuantityStepper } from "@/components/discovery/quantity-stepper";
import {
  DINE_IN_RECOMMENDATIONS,
  formatPrice,
} from "@/constants/dine-in";
import { useCart } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import type { DiscoveryMenuItem } from "@repo/utils";
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

export default function DineInCartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    items,
    subtotal,
    serviceFee,
    total,
    addItem,
    updateItemQuantity,
    removeItem,
  } = useCart();

  const handleAddRecommendation = (item: DiscoveryMenuItem) => {
    addItem({
      itemId: item.id,
      name: item.name,
      branchId: item.branchId,
      restaurantId: item.restaurantId ?? "",
      restaurantName: item.restaurantName ?? "",
      quantity: 1,
      unitPrice: item.discountPrice ?? item.price,
      image: item.image,
    });
  };

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <View style={{ paddingTop: insets.top }}>
        <TableHeader />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[32px] font-extrabold text-[#171B20] mt-4 mb-5">
          Cart Review
        </Text>

        {items.map((line) => (
          <View
            key={`${line.itemId}-${line.variationId ?? "base"}`}
            className="bg-white rounded-[12px] border border-[#E8EBF0] p-4 mb-3"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-[18px] font-bold text-[#1A1A1A]">
                  {line.name}
                </Text>
                <Text className="mt-1 text-[16px] font-semibold text-[#065FCC]">
                  {formatPrice(line.unitPrice)}
                </Text>
              </View>
              <QuantityStepper
                value={line.quantity}
                onChange={(quantity) =>
                  updateItemQuantity(line.itemId, quantity, line.variationId)
                }
              />
            </View>
            <TouchableOpacity
              onPress={() => removeItem(line.itemId, line.variationId)}
              className="mt-3 self-start"
            >
              <Text className="text-[15px] font-semibold text-[#E53935]">
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text className="text-[20px] font-bold text-[#171B20] mt-4 mb-3">
          Recommended for You
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
        >
          {DINE_IN_RECOMMENDATIONS.map((item) => (
            <View
              key={item.id}
              className="w-36 bg-white rounded-[12px] border border-[#E8EBF0] p-3"
            >
              <View className="w-full h-20 rounded-[8px] overflow-hidden mb-2 bg-[#F2F3F5]">
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                ) : null}
              </View>
              <Text
                className="text-[14px] font-semibold text-[#1A1A1A]"
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-[14px] font-bold text-[#065FCC]">
                  {formatPrice(item.discountPrice ?? item.price)}
                </Text>
                <TouchableOpacity
                  onPress={() => handleAddRecommendation(item)}
                  className="w-7 h-7 rounded-full bg-[#065FCC] items-center justify-center"
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="bg-white rounded-[12px] border border-[#E8EBF0] p-5 mt-4">
          <Text className="text-[18px] font-bold text-[#171B20] mb-4">
            Order Summary
          </Text>
          <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
          <SummaryRow
            label="Service Fee (10%)"
            value={formatPrice(serviceFee)}
          />
          <View className="h-px bg-[#E8EBF0] my-3" />
          <View className="flex-row items-center justify-between">
            <Text className="text-[18px] font-extrabold text-[#171B20]">
              Total
            </Text>
            <Text className="text-[20px] font-extrabold text-[#171B20]">
              {formatPrice(total)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8EBF0] px-5 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <TouchableOpacity
          onPress={() => router.push("/dine-in/payment" as Href)}
          disabled={items.length === 0}
          activeOpacity={0.9}
          className={`h-[56px] rounded-[12px] items-center justify-center ${
            items.length === 0 ? "bg-[#B0B8C4]" : "bg-[#065FCC]"
          }`}
        >
          <Text className="text-[17px] font-bold text-white">
            Go to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-[15px] text-[#5A6270]">{label}</Text>
      <Text className="text-[15px] font-semibold text-[#1A1A1A]">{value}</Text>
    </View>
  );
}
