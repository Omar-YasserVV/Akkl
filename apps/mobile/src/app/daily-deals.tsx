import { BottomTabInset } from "@/constants/theme";
import { useCart } from "@/context/cart-context";
import { useLocation } from "@/context/location-context";
import { Ionicons } from "@expo/vector-icons";
import {
  discoveryApis,
  type DiscoveryHome,
  type DiscoveryMenuItem,
} from "@repo/utils";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const fallbackDeals: DiscoveryMenuItem[] = [
  {
    id: "deal-truffle-burger",
    branchId: "downtown-branch",
    menuItemId: "deal-truffle-burger",
    name: "Lunch Special: Truffle Burger",
    description:
      "Wagyu beef patty, black truffle aioli, and wild mushrooms on a toasted bun.",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85",
    category: "Burgers",
    price: 24,
    discountPrice: 12,
    preparationTime: 18,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: "akkl",
    restaurantName: "Akkl",
    branchName: "Downtown Branch",
    subtitle: "Ends in 45:10",
  },
  {
    id: "deal-pepperoni",
    branchId: "downtown-branch",
    menuItemId: "deal-pepperoni",
    name: "Family Feast: Classic Pepperoni",
    description:
      "Hand-tossed dough, organic tomato sauce, and premium spicy pepperoni.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=85",
    category: "Pizza",
    price: 18.5,
    discountPrice: 12.95,
    preparationTime: 20,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: "akkl",
    restaurantName: "Akkl",
    branchName: "Downtown Branch",
    subtitle: "12 items left today",
  },
  {
    id: "deal-wellness-bowl",
    branchId: "downtown-branch",
    menuItemId: "deal-wellness-bowl",
    name: "Wellness Bowl Duo",
    description:
      "Buy one signature Wellness Bowl and get a second one of equal value for free.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
    category: "Bowls",
    price: 15,
    discountPrice: null,
    preparationTime: 12,
    isAvailable: true,
    variations: [],
    dietaryTags: [],
    restaurantId: "akkl",
    restaurantName: "Akkl",
    branchName: "Downtown Branch",
    badge: "Bogo FREE",
    subtitle: "Limited time: 2h left",
  },
];

const formatPrice = (price: number) => `${price.toFixed(2)} LE`;

export default function DailyDealsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lat, lng } = useLocation();
  const { addItem } = useCart();
  const [home, setHome] = useState<DiscoveryHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDeals = useCallback(async () => {
    try {
      const data = await discoveryApis.getHome(
        lat ?? undefined,
        lng ?? undefined,
      );
      setHome(data);
    } catch (error) {
      console.error("Failed to load daily deals", error);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  const deals = useMemo(() => {
    const liveDeals = [...(home?.offers ?? []), ...(home?.topDeals ?? [])];
    return liveDeals.length ? liveDeals : fallbackDeals;
  }, [home]);

  const openItem = (item: DiscoveryMenuItem) => {
    if (fallbackDeals.some((deal) => deal.id === item.id)) return;
    router.push({
      pathname: "/item/[id]",
      params: { id: item.id, branchId: item.branchId },
    });
  };

  const addDealToCart = (item: DiscoveryMenuItem) => {
    addItem({
      itemId: item.id,
      name: item.name,
      branchId: item.branchId,
      restaurantId: item.restaurantId ?? "",
      restaurantName: item.restaurantName ?? "Akkl",
      quantity: 1,
      unitPrice: item.discountPrice ?? item.price,
      image: item.image,
    });
    Alert.alert("Added to cart", `${item.name} has been added.`);
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
          Daily Deals
        </Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <Ionicons name="person-circle-outline" size={34} color="#424957" />
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
        <View
          className="mt-5 mb-8 rounded-[10px] bg-[#0A78F4] px-6 py-5 flex-row items-center justify-between"
          style={{
            shadowColor: "#0B62C6",
            shadowOpacity: 0.24,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 7 },
            elevation: 5,
          }}
        >
          <View>
            <Text className="text-[16px] leading-5 font-bold uppercase text-white/80">
              Hurry Up!
            </Text>
            <Text className="mt-1 text-[24px] leading-8 font-bold text-white">
              Flash Sales Ending Soon
            </Text>
          </View>
          <View className="rounded-full bg-white/20 px-4 py-2">
            <Text className="text-[18px] font-extrabold text-white">
              02:45:12
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View className="h-[360px] items-center justify-center">
            <ActivityIndicator size="large" color="#065FCC" />
          </View>
        ) : (
          deals.map((item, index) => (
            <DealCard
              key={`${item.id}-${index}`}
              item={item}
              onPress={() => openItem(item)}
              onAdd={() => addDealToCart(item)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function DealCard({
  item,
  onPress,
  onAdd,
}: {
  item: DiscoveryMenuItem;
  onPress: () => void;
  onAdd: () => void;
}) {
  const discount =
    item.discountPrice && item.price
      ? Math.round((1 - item.discountPrice / item.price) * 100)
      : null;
  const label = item.badge ?? (discount ? `${discount}% OFF` : "LIMITED");
  const price = item.discountPrice ?? item.price;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      className="mb-8 overflow-hidden rounded-[12px] bg-white border border-[#E6EAF0]"
      style={{
        shadowColor: "#0B1220",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 3,
      }}
    >
      <View className="h-[244px] bg-[#E9EDF3]">
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : null}
        <View className="absolute left-4 top-4 rounded-[8px] bg-[#D61F26] px-4 py-2">
          <Text className="text-[17px] font-extrabold text-white">
            {label}
          </Text>
        </View>
      </View>

      <View className="px-5 py-5">
        <View className="flex-row items-start">
          <View className="flex-1 pr-3">
            <Text
              className="text-[25px] leading-8 font-extrabold text-[#20242A]"
              numberOfLines={2}
            >
              {item.name}
            </Text>
            {item.description ? (
              <Text className="mt-2 text-[18px] leading-6 text-[#5D6675]">
                {item.description}
              </Text>
            ) : null}
          </View>
          <Ionicons name="star-outline" size={30} color="#065FCC" />
        </View>

        <View className="mt-5 flex-row items-center">
          <Ionicons name="time-outline" size={18} color="#065FCC" />
          <Text className="ml-2 text-[16px] font-extrabold text-[#065FCC]">
            {item.subtitle ?? "Ends in 45:10"}
          </Text>
        </View>

        <View className="mt-7 flex-row items-end justify-between">
          <View>
            {item.discountPrice ? (
              <Text className="text-[15px] leading-5 text-[#606A78] line-through">
                {formatPrice(item.price)}
              </Text>
            ) : (
              <Text className="text-[15px] leading-5 text-[#606A78]">
                Starting at
              </Text>
            )}
            <Text className="text-[27px] leading-9 font-extrabold text-[#065FCC]">
              {formatPrice(price)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onAdd}
            activeOpacity={0.88}
            className="h-[52px] min-w-[172px] rounded-[8px] bg-[#065FCC] items-center justify-center px-6"
          >
            <Text className="text-[20px] font-extrabold text-white">
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
