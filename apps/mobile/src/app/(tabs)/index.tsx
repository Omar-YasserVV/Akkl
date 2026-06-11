import { BottomTabInset } from "@/constants/theme";
import { useLocation } from "@/context/location-context";
import { useSession } from "@/context/session-context";
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
  const { restaurant, branch } = useSession();
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
          paddingBottom: BottomTabInset,
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
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-row gap-1 items-center flex-1"
            onPress={() =>
              router.push({
                pathname: "/select-branch",
                params: { change: "true" },
              })
            }
          >
            <Ionicons name="location-sharp" size={23} color="#0057C0" />
            <View className="flex-1">
              <Text
                className="text-[18px] leading-7 font-semibold text-[#0057C0]"
                numberOfLines={1}
              >
                {branch?.name ?? "Select branch"}
              </Text>
              {restaurant ? (
                <Text
                  className="text-[12px] text-[#7B8495]"
                  numberOfLines={1}
                >
                  {restaurant.name}
                </Text>
              ) : null}
            </View>
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
            onPress={() => {
              if (branch?.id) {
                router.push({
                  pathname: "/pickup/menu",
                  params: { branchId: branch.id },
                });
              } else {
                router.push("/select-branch");
              }
            }}
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
          className="rounded-[10px] border border-[#BEC8DA] bg-white px-6 flex-row items-center mb-9"
        >
          <View className="flex-row items-center gap-3 flex-1 py-4">
            <Ionicons name="restaurant-outline" size={18} color="#0057C0" />
            <Text className="flex-1 text-[16px] text-[#191C1D]">
              Book a Table
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#737C8B" />
        </TouchableOpacity>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[22px] font-semibold text-[#191C1D]">
            Featured Items
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/explore")}
            activeOpacity={0.8}
          >
            <Text className="text-[14px] font-semibold text-[#0057C0]">
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="h-90 items-center justify-center">
            <ActivityIndicator size="large" color="#0057C0" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => openItem(featuredItem)}
            activeOpacity={0.92}
            className="overflow-hidden rounded-[12px] shadow-md bg-white"
            style={{ marginBottom: 60 }}
          >
            <Image
              source={{ uri: featuredItem.image ?? fallbackFeaturedImage }}
              style={{ width: "100%", height: 200 }}
              contentFit="cover"
            />
            <View className="bg-white px-3 py-4">
              <Text
                className="text-[18px] font-extrabold text-[#1C2026]"
                numberOfLines={1}
              >
                {featuredItem.name}
              </Text>
              <Text className="mt-1 text-[16px] font-extrabold text-[#0057C0]">
                {formatPrice(featuredItem.discountPrice ?? featuredItem.price)}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View className="flex-row gap-6">
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
      className="flex-1 p-3 gap-1 bg-[#f3f4f5] rounded-[15px] border border-[#E2E6EC] items-center justify-center"
      style={{
        shadowColor: "#0B1220",
        shadowOpacity: 0.07,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View className="p-4 rounded-full bg-[#0057C0] items-center justify-center">
        <Ionicons name={icon} size={30} color="#FFFFFF" />
      </View>
      <Text className="text-[18px] mt-1 font-semibold text-[#191C1D]">
        {title}
      </Text>
      <Text className=" text-[11px] font-semibold text-[#414755]">
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
      className="flex-1 py-5 rounded-[15px] bg-[#ECEDEF] px-6 justify-center"
    >
      <Ionicons name={icon} size={21} color="#0057C0" />
      <Text className="mt-3 text-[14px] font-bold text-[#24282F]">{label}</Text>
    </TouchableOpacity>
  );
}
