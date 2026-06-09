import { MenuItemRow } from "@/components/discovery/menu-item-row";
import { useCart } from "@/context/cart-context";
import { useLocation } from "@/context/location-context";
import { Ionicons } from "@expo/vector-icons";
import {
  discoveryApis,
  type DiscoveryBranchMenu,
  type DiscoveryRestaurant,
} from "@repo/utils";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, branchId: initialBranchId } = useLocalSearchParams<{
    id: string;
    branchId?: string;
  }>();
  const { lat, lng } = useLocation();
  const { setBranchContext } = useCart();
  const [restaurant, setRestaurant] = useState<DiscoveryRestaurant | null>(
    null,
  );
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(
    initialBranchId ?? null,
  );
  const [menu, setMenu] = useState<DiscoveryBranchMenu | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadRestaurant = useCallback(async () => {
    if (!id) return;
    try {
      const data = await discoveryApis.getRestaurantById(
        id,
        lat ?? undefined,
        lng ?? undefined,
      );
      setRestaurant(data);
      const branch =
        initialBranchId ??
        data.nearestBranch?.id ??
        data.branches?.[0]?.id ??
        null;
      setSelectedBranchId(branch);
    } catch (error) {
      console.error("Failed to load restaurant", error);
    }
  }, [id, lat, lng, initialBranchId]);

  const loadMenu = useCallback(
    async (branchId: string) => {
      try {
        const data = await discoveryApis.getBranchMenu(branchId);
        setMenu(data);
        setBranchContext({
          branchId: data.branch.id,
          restaurantId: data.branch.restaurant.id,
          restaurantName: data.branch.restaurant.name,
          branchName: data.branch.name,
        });
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setBranchContext],
  );

  useEffect(() => {
    loadRestaurant();
  }, [loadRestaurant]);

  useEffect(() => {
    if (selectedBranchId) {
      setIsLoading(true);
      loadMenu(selectedBranchId);
    }
  }, [selectedBranchId, loadMenu]);

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
            Restaurant
          </Text>
        </View>

        {restaurant ? (
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden mr-4">
              {restaurant.logoUrl ? (
                <Image
                  source={{ uri: restaurant.logoUrl }}
                  style={{ width: 64, height: 64 }}
                  contentFit="cover"
                />
              ) : null}
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-[#2D2D2D]">
                {restaurant.name}
              </Text>
              <Text className="text-sm text-[#9BA5B7] mt-1">
                {restaurant.cuisineLabel} · {restaurant.branchCount} branches
              </Text>
            </View>
          </View>
        ) : null}
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
          {restaurant?.branches && restaurant.branches.length > 1 ? (
            <View className="mb-4">
              <Text className="text-xs font-semibold tracking-widest text-[#9BA5B7] mb-2">
                SELECT BRANCH
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {restaurant.branches.map((branch) => (
                  <TouchableOpacity
                    key={branch.id}
                    onPress={() => setSelectedBranchId(branch.id)}
                    className={`mr-2 px-4 py-3 rounded-2xl border ${
                      selectedBranchId === branch.id
                        ? "bg-primary/10 border-primary"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <Text className="font-medium text-[#2D2D2D]">
                      {branch.name}
                    </Text>
                    <Text className="text-xs text-[#9BA5B7] mt-1">
                      {branch.openStatus.replace("_", " ")}
                      {branch.distanceKm != null
                        ? ` · ${branch.distanceKm.toFixed(1)} km`
                        : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {menu?.categories.map((section) => (
            <View key={section.category} className="mb-4">
              <Text className="text-lg font-bold text-[#2D2D2D] mb-3">
                {section.label}
              </Text>
              {section.items.map((item) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  showRestaurant={false}
                  onPress={() =>
                    router.push({
                      pathname: "/item/[id]",
                      params: {
                        id: item.id,
                        branchId: selectedBranchId ?? item.branchId,
                      },
                    })
                  }
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
