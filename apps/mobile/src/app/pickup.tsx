import { BranchCard } from "@/components/discovery/branch-card";
import { FilterChips } from "@/components/discovery/filter-chips";
import { SearchBar } from "@/components/discovery/search-bar";
import { useCart } from "@/context/cart-context";
import { useLocation } from "@/context/location-context";
import { Ionicons } from "@expo/vector-icons";
import { discoveryApis, type DiscoveryBranch } from "@repo/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FILTERS = [
  { id: "nearest", label: "Nearest" },
  { id: "open", label: "Open Now" },
];

export default function PickupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { lat, lng } = useLocation();
  const { setBranchContext } = useCart();
  const [branches, setBranches] = useState<DiscoveryBranch[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("nearest");
  const [isLoading, setIsLoading] = useState(true);

  const title = mode === "dine-in" ? "Select Location" : "Nearby Restaurants";

  const loadBranches = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await discoveryApis.getBranchesNearby({
        lat: lat ?? undefined,
        lng: lng ?? undefined,
        openNow: filter === "open",
        q: query || undefined,
      });
      setBranches(data);
    } catch (error) {
      console.error("Failed to load branches", error);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng, filter, query]);

  useEffect(() => {
    const timer = setTimeout(loadBranches, query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadBranches, query]);

  const sortedBranches = useMemo(() => {
    if (filter === "nearest" && lat != null && lng != null) {
      return [...branches].sort(
        (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
      );
    }
    return branches;
  }, [branches, filter, lat, lng]);

  const handleSelect = (branch: DiscoveryBranch) => {
    setBranchContext({
      branchId: branch.id,
      restaurantId: branch.restaurant.id,
      restaurantName: branch.restaurant.name,
      branchName: branch.name,
    });
    router.push({
      pathname: "/restaurant/[id]",
      params: { id: branch.restaurant.id, branchId: branch.id },
    });
  };

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white px-4 pb-4 border-b border-gray-100"
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={24} color="#2D2D2D" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#2D2D2D] flex-1 text-center mr-8">
            {title}
          </Text>
        </View>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search restaurants or branches"
        />
        <View className="mt-4">
          <FilterChips
            chips={FILTERS}
            selectedId={filter}
            onSelect={setFilter}
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1565C0" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {sortedBranches.map((branch, index) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              primary={index === 0}
              onSelect={() => handleSelect(branch)}
            />
          ))}
          {!sortedBranches.length ? (
            <Text className="text-center text-[#9BA5B7] mt-8">
              No restaurants found nearby
            </Text>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}
