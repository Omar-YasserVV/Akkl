import { useCart } from "@/context/cart-context";
import { useLocation } from "@/context/location-context";
import { useSession } from "@/context/session-context";
import { Ionicons } from "@expo/vector-icons";
import { discoveryApis, type DiscoveryBranch } from "@repo/utils";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SelectBranchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { change } = useLocalSearchParams<{ change?: string }>();
  const isChanging = change === "true";
  const { lat, lng } = useLocation();
  const { restaurant, setBranch } = useSession();
  const { setBranchContext } = useCart();
  const [branches, setBranches] = useState<DiscoveryBranch[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadBranches = useCallback(async () => {
    if (!restaurant) return;
    setIsLoading(true);
    try {
      const data = await discoveryApis.getBranchesNearby({
        lat: lat ?? undefined,
        lng: lng ?? undefined,
        restaurantId: restaurant.id,
        openNow: false,
        q: query || undefined,
      });
      setBranches(data);
    } catch (error) {
      console.error("Failed to load branches", error);
      setBranches([]);
    } finally {
      setIsLoading(false);
    }
  }, [restaurant, lat, lng, query]);

  useEffect(() => {
    const timer = setTimeout(loadBranches, query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadBranches, query]);

  const visibleBranches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? branches.filter(
          (branch) =>
            branch.name.toLowerCase().includes(normalizedQuery) ||
            branch.address?.toLowerCase().includes(normalizedQuery),
        )
      : branches;

    return [...filtered].sort(
      (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
    );
  }, [branches, query]);

  const handleSelect = async (branch: DiscoveryBranch) => {
    await setBranch({ id: branch.id, name: branch.name });
    setBranchContext({
      branchId: branch.id,
      restaurantId: branch.restaurant.id,
      restaurantName: branch.restaurant.name,
      branchName: branch.name,
    });

    if (isChanging) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  if (!restaurant) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8FA]">
        <ActivityIndicator size="large" color="#065FCC" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <View
        className="bg-white px-6 pb-5 border-b border-[#E5EAF2]"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center mb-4">
          {isChanging ? (
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#20242A" />
            </TouchableOpacity>
          ) : null}
          <View className="flex-1">
            <Text className="text-[22px] font-extrabold text-[#20242A]">
              Choose a Branch
            </Text>
            <Text className="mt-1 text-[14px] text-[#6E7682]">
              {restaurant.name}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/select-restaurant")}>
            <Text className="text-[14px] font-bold text-[#065FCC]">Change</Text>
          </TouchableOpacity>
        </View>

        <View className="h-[48px] rounded-[8px] border border-[#DDE3ED] bg-[#F4F6F9] px-4 flex-row items-center">
          <Ionicons name="search" size={20} color="#7C8798" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search branches..."
            placeholderTextColor="#8D96A6"
            className="ml-3 flex-1 text-[16px] text-[#20242A]"
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#065FCC" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-5 pt-5"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          {visibleBranches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onSelect={() => handleSelect(branch)}
            />
          ))}
          {!visibleBranches.length ? (
            <Text className="mt-8 text-center text-[16px] text-[#7B8495]">
              No branches found for this restaurant.
            </Text>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

function BranchCard({
  branch,
  onSelect,
}: {
  branch: DiscoveryBranch;
  onSelect: () => void;
}) {
  const isOpen = branch.openStatus === "OPEN";

  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.88}>
      <View className="mb-4 rounded-[10px] bg-white p-4 border border-[#E7EBF2] shadow-md">
        <View className="flex-row">
          <View className="h-[72px] w-[72px] overflow-hidden rounded-[8px] bg-[#EEF1F5]">
            {branch.restaurant.logoUrl ? (
              <Image
                source={{ uri: branch.restaurant.logoUrl }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : null}
          </View>

          <View className="ml-4 flex-1">
            <Text
              className="text-[18px] font-extrabold text-[#20242A]"
              numberOfLines={2}
            >
              {branch.name}
            </Text>
            {branch.address ? (
              <Text
                className="mt-1 text-[13px] text-[#5F6878]"
                numberOfLines={2}
              >
                {branch.address}
              </Text>
            ) : null}

            <View className="mt-2 flex-row items-center">
              <View
                className={`h-2 w-2 rounded-full ${
                  isOpen ? "bg-[#13A85B]" : "bg-[#F04438]"
                }`}
              />
              <Text
                className={`ml-2 text-[12px] font-extrabold ${
                  isOpen ? "text-[#128A4D]" : "text-[#D83A32]"
                }`}
              >
                {branch.openStatus.replace("_", " ")}
                {branch.openUntil ? ` · until ${branch.openUntil}` : ""}
              </Text>
              {branch.distanceKm != null ? (
                <Text className="ml-2 text-[12px] font-semibold text-[#065FCC]">
                  · {branch.distanceKm.toFixed(1)} km
                </Text>
              ) : null}
            </View>

            <Text className="text-[14px] font-extrabold text-white">
              Select Branch
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
