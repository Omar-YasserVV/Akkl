import { BottomTabInset } from "@/constants/theme";
import { useCart } from "@/context/cart-context";
import { useLocation } from "@/context/location-context";
import { Ionicons } from "@expo/vector-icons";
import { discoveryApis, type DiscoveryBranch } from "@repo/utils";
import { Image } from "expo-image";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
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

const fallbackBranches: DiscoveryBranch[] = [
  {
    id: "downtown-branch",
    name: "Downtown Branch",
    address: "Smart Dining HQ, 5th Ave",
    latitude: null,
    longitude: null,
    status: "ACTIVE",
    openStatus: "OPEN",
    openUntil: "10:00 PM",
    distanceKm: 0.4,
    restaurant: {
      id: "akkl",
      name: "Smart Restaurant",
      logoUrl:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=300&q=80",
    },
  },
  {
    id: "uptown-hub",
    name: "Uptown Hub",
    address: "42 Garden Street",
    latitude: null,
    longitude: null,
    status: "ACTIVE",
    openStatus: "CLOSING_SOON",
    openUntil: "8:30 PM",
    distanceKm: 1.2,
    restaurant: {
      id: "akkl",
      name: "Smart Restaurant",
      logoUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80",
    },
  },
  {
    id: "east-side-kitchen",
    name: "East Side Kitchen",
    address: "88 Market Road",
    latitude: null,
    longitude: null,
    status: "ACTIVE",
    openStatus: "OPEN",
    openUntil: "11:00 PM",
    distanceKm: 2.8,
    restaurant: {
      id: "akkl",
      name: "Smart Restaurant",
      logoUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80",
    },
  },
];

export default function PickupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { lat, lng } = useLocation();
  const { setBranchContext } = useCart();
  const [branches, setBranches] = useState<DiscoveryBranch[]>([]);
  const [query, setQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadBranches = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await discoveryApis.getBranchesNearby({
        lat: lat ?? undefined,
        lng: lng ?? undefined,
        openNow: true,
        q: query || undefined,
      });
      setBranches(data.length ? data : fallbackBranches);
    } catch (error) {
      console.warn("Failed to load branches, using fallback data", error);
      setBranches(fallbackBranches);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng, query]);

  useEffect(() => {
    const timer = setTimeout(loadBranches, query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadBranches, query]);

  const visibleBranches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const source = branches.length ? branches : fallbackBranches;
    const filtered = normalizedQuery
      ? source.filter(
          (branch) =>
            branch.name.toLowerCase().includes(normalizedQuery) ||
            branch.restaurant.name.toLowerCase().includes(normalizedQuery) ||
            branch.address?.toLowerCase().includes(normalizedQuery),
        )
      : source;

    return [...filtered].sort(
      (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
    );
  }, [branches, query]);

  const handleSelect = (branch: DiscoveryBranch) => {
    setBranchContext({
      branchId: branch.id,
      restaurantId: branch.restaurant.id,
      restaurantName: branch.restaurant.name,
      branchName: branch.name,
    });

    router.push({
      pathname: "/pickup/menu",
      params: {
        branchId: branch.id,
      },
    } as unknown as Href);
  };

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <View
        className="bg-white px-6 pb-5 border-b border-[#E5EAF2]"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center flex-1">
            <Ionicons name="restaurant" size={22} color="#065FCC" />
            <Text
              className="ml-2 text-[22px] leading-8 font-extrabold text-[#065FCC]"
              numberOfLines={1}
            >
              Smart Restaurant
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <Ionicons name="person-circle-outline" size={30} color="#424957" />
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

        <View className="mt-5 flex-row items-center justify-between">
          <Text className="text-[18px] leading-6 font-extrabold text-[#20242A]">
            Find a Location
          </Text>
          <TouchableOpacity
            onPress={() => setShowMap((current) => !current)}
            activeOpacity={0.86}
            className="h-[34px] rounded-full bg-[#EEF2F8] px-4 flex-row items-center"
          >
            <Ionicons
              name={showMap ? "list-outline" : "map-outline"}
              size={17}
              color="#687386"
            />
            <Text className="ml-2 text-[14px] font-bold text-[#687386]">
              {showMap ? "Show List" : "Show Map"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#065FCC" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 22,
            paddingTop: 22,
            paddingBottom: BottomTabInset + 30,
          }}
        >
          {showMap ? <MapPreview /> : null}

          {visibleBranches.map((branch) => (
            <PickupBranchCard
              key={branch.id}
              branch={branch}
              onSelect={() => handleSelect(branch)}
            />
          ))}

          {!visibleBranches.length ? (
            <Text className="mt-8 text-center text-[16px] text-[#7B8495]">
              No pick-up locations found.
            </Text>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

function MapPreview() {
  return (
    <View className="mb-5 h-[150px] overflow-hidden rounded-[12px] bg-[#B8D7D9] border border-[#DDE3ED]">
      <View className="absolute left-8 top-5 h-24 w-10 rotate-12 bg-white/45" />
      <View className="absolute right-8 top-0 h-36 w-14 -rotate-12 bg-white/35" />
      <View className="absolute left-0 top-20 h-6 w-full bg-white/45" />
      <View className="absolute left-1/2 top-10 -ml-4 h-8 w-8 rounded-full bg-[#065FCC] items-center justify-center">
        <Ionicons name="location-sharp" size={19} color="#FFFFFF" />
      </View>
    </View>
  );
}

function PickupBranchCard({
  branch,
  onSelect,
}: {
  branch: DiscoveryBranch;
  onSelect: () => void;
}) {
  const isOpen = branch.openStatus === "OPEN";

  return (
    <View className="mb-4 rounded-[10px] bg-white p-4 border border-[#E7EBF2]">
      <View className="flex-row">
        <View className="h-[92px] w-[92px] overflow-hidden rounded-[8px] bg-[#EEF1F5]">
          {branch.restaurant.logoUrl ? (
            <Image
              source={{ uri: branch.restaurant.logoUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : null}
        </View>

        <View className="ml-4 flex-1">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              <Text
                className="text-[20px] leading-6 font-extrabold text-[#20242A]"
                numberOfLines={2}
              >
                {branch.name}
              </Text>
              <Text
                className="mt-1 text-[14px] leading-5 font-semibold text-[#5F6878]"
                numberOfLines={1}
              >
                {branch.restaurant.name}
              </Text>
            </View>

            {branch.distanceKm != null ? (
              <View className="rounded-[6px] bg-[#E9F2FF] px-3 py-1">
                <Text className="text-[13px] font-extrabold text-[#065FCC]">
                  {branch.distanceKm.toFixed(1)}
                </Text>
                <Text className="text-[11px] font-bold text-[#065FCC]">
                  mi
                </Text>
              </View>
            ) : null}
          </View>

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
            </Text>
          </View>

          <TouchableOpacity
            onPress={onSelect}
            activeOpacity={0.88}
            className="mt-3 h-[42px] rounded-[7px] bg-[#065FCC] items-center justify-center"
          >
            <Text className="text-[15px] font-extrabold text-white">
              Select Branch
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
