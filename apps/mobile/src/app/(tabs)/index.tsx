import { BottomTabInset } from "@/constants/theme";
import { useLocation } from "@/context/location-context";
import { Ionicons } from "@expo/vector-icons";
import {
  discoveryApis,
  type DiscoveryHome,
  type DiscoveryMenuItem,
} from "@repo/utils";
import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const fallbackFeaturedImage =
  "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80";

const fallbackFeatured: DiscoveryMenuItem = {
  id: "featured-avocado-toast",
  branchId: "downtown-branch",
  menuItemId: "featured-avocado-toast",
  name: "Avocado Toast",
  image: fallbackFeaturedImage,
  category: "Breakfast",
  price: 14,
  discountPrice: null,
  preparationTime: 12,
  isAvailable: true,
  variations: [],
  dietaryTags: [],
};

const formatPrice = (price: number) => `${price.toFixed(2)} LE`;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lat, lng } = useLocation();
  const [home, setHome] = useState<DiscoveryHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHome = useCallback(async () => {
    try {
      const data = await discoveryApis.getHome(
        lat ?? undefined,
        lng ?? undefined,
      );
      setHome(data);
    } catch (error) {
      console.error("Failed to load home feed", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  const featuredItem = useMemo(
    () => home?.offers?.[0] ?? home?.topDeals?.[0] ?? fallbackFeatured,
    [home],
  );

  const openItem = (item: DiscoveryMenuItem) => {
    if (item.id === fallbackFeatured.id) {
      router.push("/(tabs)/explore");
      return;
    }

    router.push({
      pathname: "/item/[id]",
      params: { id: item.id, branchId: item.branchId },
    });
  };

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: BottomTabInset + 34,
          paddingTop: insets.top + 20,
          paddingHorizontal: 30,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadHome();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-row gap-1 items-center flex-1"
          >
            <Ionicons name="location-sharp" size={23} color="#065FCC" />
            <Text
              className="text-[18px] leading-9 font-semibold text-[#065FCC]"
              numberOfLines={1}
            >
              Downtown Branch
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color="#7B8495"
              style={{ marginTop: 3 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            activeOpacity={0.85}
            className="ml-4"
          >
            <Ionicons name="person-circle-outline" size={34} color="#424957" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/search")}
          activeOpacity={0.9}
          className="h-14 rounded-[10px] border border-[#E0E4EA] bg-[#f3f4f5] px-6 flex-row items-center mb-9"
        >
          <Ionicons name="search" size={20} color="#404958" />
          <Text className="ml-5 text-[15px] text-[#858C9B]">
            Search for dishes, drinks...
          </Text>
        </TouchableOpacity>

        <View className="flex-row gap-6 mb-9">
          <ActionTile
            icon="bag-handle"
            title="Pick Up"
            subtitle="Order ahead"
            onPress={() =>
              router.push({
                pathname: "/pickup",
                params: { mode: "pickup" },
              })
            }
          />
          <ActionTile
            icon="qr-code"
            title="Dine In"
            subtitle="Scan QR"
            onPress={() => router.push("/dine-in/scan" as Href)}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          className="h-[86px] rounded-[10px] border border-[#BEC8DA] bg-white px-6 flex-row items-center mb-9"
        >
          <Ionicons name="restaurant-outline" size={30} color="#065FCC" />
          <Text className="ml-6 flex-1 text-[25px] text-[#20242A]">
            Book a Table
          </Text>
          <Ionicons name="chevron-forward" size={27} color="#737C8B" />
        </TouchableOpacity>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[32px] leading-10 font-extrabold text-[#171B20]">
            Featured Items
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/explore")}
            activeOpacity={0.8}
          >
            <Text className="text-[20px] font-semibold text-[#065FCC]">
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="h-90 items-center justify-center">
            <ActivityIndicator size="large" color="#065FCC" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => openItem(featuredItem)}
            activeOpacity={0.92}
            className="overflow-hidden rounded-t-[12px] bg-white"
            style={{ marginBottom: 60 }}
          >
            <Image
              source={{ uri: featuredItem.image ?? fallbackFeaturedImage }}
              style={{ width: "100%", height: 758 }}
              contentFit="cover"
            />
            <View className="bg-white px-3 py-4">
              <Text
                className="text-[27px] leading-9 font-extrabold text-[#1C2026]"
                numberOfLines={1}
              >
                {featuredItem.name}
              </Text>
              <Text className="mt-1 text-[25px] leading-8 font-extrabold text-[#065FCC]">
                {formatPrice(featuredItem.discountPrice ?? featuredItem.price)}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View className="flex-row gap-6 mt-10">
          <ShortcutTile
            icon="star-outline"
            label="Daily Deals"
            onPress={() => router.push("../daily-deals")}
          />
          <ShortcutTile
            icon="refresh-outline"
            label="Quick Reorder"
            onPress={() => router.push("../quick-reorder")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function ActionTile({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      className="flex-1 h-[208px] rounded-[15px] border border-[#E2E6EC] bg-white items-center justify-center"
      style={{
        shadowColor: "#0B1220",
        shadowOpacity: 0.07,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View className="h-[84px] w-[84px] rounded-full bg-[#065FCC] items-center justify-center mb-4">
        <Ionicons name={icon} size={40} color="#FFFFFF" />
      </View>
      <Text className="text-[28px] leading-9 font-extrabold text-[#20242A]">
        {title}
      </Text>
      <Text className="mt-1 text-[17px] leading-6 font-semibold text-[#4D5563]">
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

function ShortcutTile({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.86}
      className="flex-1 h-[178px] rounded-[15px] bg-[#ECEDEF] px-6 justify-center"
    >
      <Ionicons name={icon} size={31} color="#065FCC" />
      <Text className="mt-3 text-[18px] leading-6 font-extrabold text-[#24282F]">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
