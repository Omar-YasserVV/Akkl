import { RestaurantCard } from "@/components/discovery/restaurant-card";
import { SearchBar } from "@/components/discovery/search-bar";
import { BottomTabInset } from "@/constants/theme";
import { useLocation } from "@/context/location-context";
import { discoveryApis, type DiscoveryRestaurant } from "@repo/utils";
// Changed import to relative path to fix the import error
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lat, lng } = useLocation();
  const [restaurants, setRestaurants] = useState<DiscoveryRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRestaurants = useCallback(async () => {
    try {
      const response = await discoveryApis.getRestaurants({
        page: 1,
        limit: 50,
        lat: lat ?? undefined,
        lng: lng ?? undefined,
      });
      setRestaurants(response.data);
    } catch (error) {
      console.error("Failed to load restaurants", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4">
        <Text className="text-2xl font-bold text-[#2D2D2D] py-3">
          Explore Restaurants
        </Text>
        <SearchBar onPress={() => router.push("/search")} editable={false} />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1565C0" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: BottomTabInset + 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadRestaurants();
              }}
            />
          }
        >
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={() =>
                router.push({
                  pathname: "/restaurant/[id]",
                  params: { id: restaurant.id },
                })
              }
            />
          ))}
          {!restaurants.length ? (
            <Text className="text-center text-[#9BA5B7] mt-8">
              No restaurants available yet
            </Text>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}
