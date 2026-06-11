import { RestaurantCard } from "@/components/discovery/restaurant-card";
import { useLocation } from "@/context/location-context";
import { useSession } from "@/context/session-context";
import { discoveryApis, type DiscoveryRestaurant } from "@repo/utils";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SelectRestaurantScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lat, lng } = useLocation();
  const { restaurant, setRestaurant } = useSession();
  const [restaurants, setRestaurants] = useState<DiscoveryRestaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // 1. Added state for search
  const [isLoading, setIsLoading] = useState(true);

  const loadRestaurants = useCallback(async () => {
    setIsLoading(true);
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
    }
  }, [lat, lng]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  // 2. Added client-side filtering for better performance
  const filteredRestaurants = useMemo(() => {
    if (!searchQuery.trim()) return restaurants;
    return restaurants.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [restaurants, searchQuery]);

  const handleSelect = async (item: DiscoveryRestaurant) => {
    await setRestaurant({
      id: item.id,
      name: item.name,
      logoUrl: item.logoUrl,
    });
    router.replace("/select-branch");
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {/* MODERN PREMIUM HEADER */}
      <View
        className="bg-white border-b border-[#F1F5F9] px-5 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-end justify-between mb-4">
          <View className="space-y-0.5 flex-1 pr-4">
            <Text className="text-[22px] font-bold tracking-tight text-[#0F172A]">
              Choose a Restaurant
            </Text>
            <Text className="text-[12px] font-medium text-[#64748B]">
              Select where you would like to order from
            </Text>
          </View>
          <Image
            source={require("../../../mobile/assets/images/tabIcons/Logo.png")}
            className="h-14 w-14"
            resizeMode="contain"
          />
        </View>

        {/* 3. Search Bar Component */}
        <View className="bg-[#F1F5F9] rounded-[8px] px-4 py-3 flex-row items-center">
          <TextInput
            placeholder="Search restaurants..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-[#0F172A] text-[15px] font-medium p-0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Text
              className="text-[#64748B] text-[13px] ml-2 font-medium"
              onPress={() => setSearchQuery("")}
            >
              Clear
            </Text>
          )}
        </View>
      </View>

      {/* BODY CONTENT */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0284C7" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled" // Dismisses keyboard gracefully when clicking items
        >
          {filteredRestaurants.map((item) => (
            <RestaurantCard
              key={item.id}
              restaurant={item}
              onPress={() => handleSelect(item)}
            />
          ))}
          {!filteredRestaurants.length ? (
            <Text className="text-center text-[#94A3B8] mt-12 font-medium text-[14px]">
              {searchQuery
                ? "No results found matching your search"
                : "No restaurants available yet"}
            </Text>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}
