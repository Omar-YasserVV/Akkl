import { MenuItemRow } from "@/components/discovery/menu-item-row";
import { RestaurantCard } from "@/components/discovery/restaurant-card";
import { SearchBar } from "@/components/discovery/search-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { discoveryApis, type DiscoverySearchResult } from "@repo/utils";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RECENT_KEY = "akkl_recent_searches";

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DiscoverySearchResult | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then((value) => {
      if (value) setRecent(JSON.parse(value));
    });
  }, []);

  const saveRecent = async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((r) => r !== trimmed)].slice(0, 8);
      void AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  };

  const runSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const data = await discoveryApis.search(term);
      setResults(data);
      await saveRecent(term);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => runSearch(query), 350);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

  const clearRecent = async () => {
    setRecent([]);
    await AsyncStorage.removeItem(RECENT_KEY);
  };

  const removeRecent = async (term: string) => {
    const next = recent.filter((r) => r !== term);
    setRecent(next);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  return (
    <View className="flex-1 bg-white py-5">
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white px-4 pb-4 border-b border-gray-100"
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={24} color="#2D2D2D" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#2D2D2D]">Search</Text>
        </View>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          autoFocus
          placeholder="Search restaurants, dishes, or cuisines..."
        />
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {!query && recent.length > 0 ? (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-semibold tracking-widest text-[#9BA5B7]">
                RECENT SEARCHES
              </Text>
              <TouchableOpacity onPress={clearRecent}>
                <Text className="text-primary text-sm font-medium">
                  Clear all
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {recent.map((term) => (
                <TouchableOpacity
                  key={term}
                  onPress={() => setQuery(term)}
                  className="flex-row items-center bg-gray-100 rounded-full px-3 py-2"
                >
                  <Text className="text-sm text-[#2D2D2D] mr-2">{term}</Text>
                  <TouchableOpacity onPress={() => removeRecent(term)}>
                    <Ionicons name="close" size={14} color="#9BA5B7" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        {isSearching ? (
          <ActivityIndicator color="#1565C0" className="mt-8" />
        ) : null}

        {results?.restaurants?.length ? (
          <View className="mb-6">
            <Text className="text-lg font-bold text-[#2D2D2D] mb-3">
              Restaurants
            </Text>
            {results.restaurants.map((restaurant) => (
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
          </View>
        ) : null}

        {results?.dishes?.length ? (
          <View className="mb-8">
            <Text className="text-lg font-bold text-[#2D2D2D] mb-3">
              Dishes
            </Text>
            {results.dishes.map((item) => (
              <MenuItemRow
                key={item.id}
                item={item}
                showRestaurant
                onPress={() =>
                  router.push({
                    pathname: "/item/[id]",
                    params: { id: item.id, branchId: item.branchId },
                  })
                }
              />
            ))}
          </View>
        ) : null}

        {query &&
        !isSearching &&
        !results?.restaurants?.length &&
        !results?.dishes?.length ? (
          <Text className="text-center text-[#9BA5B7] mt-8">
            No results for "{query}"
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
