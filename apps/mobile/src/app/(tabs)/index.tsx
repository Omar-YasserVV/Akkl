import { MenuItemRow } from "@/components/discovery/menu-item-row";
import { OfferCarousel } from "@/components/discovery/offer-carousel";
import { RestaurantCard } from "@/components/discovery/restaurant-card";
import { SearchBar } from "@/components/discovery/search-bar";
import { BottomTabInset } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "@/context/location-context";
import { Ionicons } from "@expo/vector-icons";
import { discoveryApis, type DiscoveryHome } from "@repo/utils";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
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

  const openItem = (itemId: string, branchId: string) => {
    router.push({
      pathname: "/item/[id]",
      params: { id: itemId, branchId },
    });
  };

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4">
        <View className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center flex-1">
            <View className="w-11 h-11 rounded-full bg-primary/10 items-center justify-center overflow-hidden mr-3">
              {user?.image ? (
                <Image
                  source={{ uri: user.image }}
                  style={{ width: 44, height: 44 }}
                  contentFit="cover"
                />
              ) : (
                <Ionicons name="person" size={22} color="#1565C0" />
              )}
            </View>
            <View>
              <Text className="text-xs text-[#9BA5B7] tracking-widest">
                WELCOME BACK
              </Text>
              <Text className="text-lg font-semibold text-[#2D2D2D]">
                Hello, {firstName}
              </Text>
            </View>
          </View>
        </View>
        <SearchBar onPress={() => router.push("/search")} editable={false} />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1565C0" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingBottom: BottomTabInset + 24,
            paddingTop: 16,
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
        >
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/pickup",
                  params: { mode: "dine-in" },
                })
              }
              className="flex-1 bg-primary rounded-2xl p-4 min-h-[110px] justify-between"
            >
              <Ionicons name="qr-code-outline" size={28} color="#fff" />
              <View>
                <Text className="text-white text-lg font-bold">Dine-in</Text>
                <Text className="text-white/80 text-sm">Pick a restaurant</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/pickup",
                  params: { mode: "pickup" },
                })
              }
              className="flex-1 bg-[#1A2744] rounded-2xl p-4 min-h-[110px] justify-between"
            >
              <Ionicons name="bag-handle-outline" size={28} color="#fff" />
              <View>
                <Text className="text-white text-lg font-bold">Pick-up</Text>
                <Text className="text-white/80 text-sm">Nearby branches</Text>
              </View>
            </TouchableOpacity>
          </View>

          {home?.featuredRestaurants?.length ? (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold text-[#2D2D2D]">
                  Featured Restaurants
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/explore")}
                >
                  <Text className="text-primary font-medium">View All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {home.featuredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    compact
                    onPress={() =>
                      router.push({
                        pathname: "/restaurant/[id]",
                        params: { id: restaurant.id },
                      })
                    }
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          {home?.offers?.length ? (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold text-[#2D2D2D]">
                  Special Offers
                </Text>
              </View>
              <OfferCarousel
                offers={home.offers}
                onPress={(item) => openItem(item.id, item.branchId)}
              />
            </View>
          ) : null}

          {home?.topDeals?.length ? (
            <View>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold text-[#2D2D2D]">
                  Top Deals
                </Text>
              </View>
              {home.topDeals.map((item) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  showRestaurant
                  onPress={() => openItem(item.id, item.branchId)}
                  onAdd={() => openItem(item.id, item.branchId)}
                />
              ))}
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}
