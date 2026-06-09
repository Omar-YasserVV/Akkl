import { BottomTabInset } from "@/constants/theme";
import { CartLineItem, useCart } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const savedOrders: CartLineItem[][] = [
  [
    {
      itemId: "saved-avocado-toast",
      name: "Avocado Toast",
      branchId: "downtown-branch",
      restaurantId: "akkl",
      restaurantName: "Akkl",
      quantity: 1,
      unitPrice: 14,
      image:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=85",
    },
    {
      itemId: "saved-cold-brew",
      name: "Cold Brew",
      branchId: "downtown-branch",
      restaurantId: "akkl",
      restaurantName: "Akkl",
      quantity: 1,
      unitPrice: 6.5,
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=85",
    },
  ],
  [
    {
      itemId: "saved-pepperoni",
      name: "Classic Pepperoni",
      branchId: "downtown-branch",
      restaurantId: "akkl",
      restaurantName: "Akkl",
      quantity: 1,
      unitPrice: 12.95,
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=85",
    },
  ],
];

const formatPrice = (price: number) => `${price.toFixed(2)} LE`;

export default function QuickReorderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cart = useCart();

  const reorderGroups = useMemo(() => {
    if (cart.items.length) return [cart.items];
    return savedOrders;
  }, [cart.items]);

  const addOrder = (items: CartLineItem[]) => {
    items.forEach((item) => {
      cart.addItem({ ...item });
    });
    Alert.alert("Added to cart", "Your favorite order is ready to review.");
  };

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <View
        className="px-7 pb-5 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 14 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={27} color="#065FCC" />
        </TouchableOpacity>
        <Text className="flex-1 ml-5 text-[30px] leading-10 font-extrabold text-[#065FCC]">
          Quick Reorder
        </Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/orders")}>
          <Ionicons name="receipt-outline" size={31} color="#424957" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 28,
          paddingBottom: BottomTabInset + 34,
        }}
      >
        <View className="mt-5 mb-8 rounded-[12px] bg-[#065FCC] px-6 py-6">
          <View className="flex-row items-center">
            <View className="h-12 w-12 rounded-full bg-white/18 items-center justify-center">
              <Ionicons name="refresh" size={26} color="#FFFFFF" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-[16px] leading-5 font-bold uppercase text-white/75">
                One Tap Favorites
              </Text>
              <Text className="mt-1 text-[24px] leading-8 font-bold text-white">
                Reorder your regulars fast
              </Text>
            </View>
          </View>
        </View>

        {cart.items.length ? (
          <Text className="mb-4 text-[21px] leading-7 font-extrabold text-[#171B20]">
            From your cart
          </Text>
        ) : (
          <Text className="mb-4 text-[21px] leading-7 font-extrabold text-[#171B20]">
            Previous favorites
          </Text>
        )}

        {reorderGroups.map((items, index) => (
          <ReorderCard
            key={`reorder-${index}`}
            title={index === 0 && cart.items.length ? "Current cart again" : `Order #${index + 1}`}
            items={items}
            onAdd={() => addOrder(items)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function ReorderCard({
  title,
  items,
  onAdd,
}: {
  title: string;
  items: CartLineItem[];
  onAdd: () => void;
}) {
  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return (
    <View
      className="mb-6 rounded-[12px] border border-[#E3E8F0] bg-white p-5"
      style={{
        shadowColor: "#0B1220",
        shadowOpacity: 0.07,
        shadowRadius: 9,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1 pr-4">
          <Text className="text-[24px] leading-8 font-extrabold text-[#20242A]">
            {title}
          </Text>
          <Text className="mt-1 text-[16px] leading-6 font-semibold text-[#657083]">
            {items[0]?.restaurantName || "Akkl"} · {items.length} item
            {items.length === 1 ? "" : "s"}
          </Text>
        </View>
        <View className="rounded-full bg-[#EAF2FF] px-3 py-2">
          <Text className="text-[16px] font-extrabold text-[#065FCC]">
            {formatPrice(total)}
          </Text>
        </View>
      </View>

      {items.map((item) => (
        <View key={`${item.itemId}-${item.variationId ?? "base"}`} className="flex-row items-center py-3">
          <View className="h-16 w-16 overflow-hidden rounded-[10px] bg-[#EEF1F5]">
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : null}
          </View>
          <View className="ml-4 flex-1">
            <Text
              className="text-[18px] leading-6 font-bold text-[#24282F]"
              numberOfLines={1}
            >
              {item.quantity}x {item.name}
            </Text>
            {item.variationLabel ? (
              <Text className="mt-1 text-[14px] text-[#7B8495]">
                {item.variationLabel}
              </Text>
            ) : null}
          </View>
          <Text className="text-[16px] font-extrabold text-[#065FCC]">
            {formatPrice(item.unitPrice)}
          </Text>
        </View>
      ))}

      <TouchableOpacity
        onPress={onAdd}
        activeOpacity={0.88}
        className="mt-5 h-[54px] rounded-[9px] bg-[#065FCC] flex-row items-center justify-center"
      >
        <Ionicons name="cart-outline" size={23} color="#FFFFFF" />
        <Text className="ml-2 text-[19px] font-extrabold text-white">
          Add Order to Cart
        </Text>
      </TouchableOpacity>
    </View>
  );
}
