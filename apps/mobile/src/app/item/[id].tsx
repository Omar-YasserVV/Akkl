import { PairingCarousel } from "@/components/discovery/pairing-carousel";
import { QuantityStepper } from "@/components/discovery/quantity-stepper";
import { useCart } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import {
  discoveryApis,
  type DiscoveryMenuItem,
  type DiscoveryMenuItemDetail,
} from "@repo/utils";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ItemCustomizeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, branchId } = useLocalSearchParams<{ id: string; branchId?: string }>();
  const { addItem } = useCart();
  const [detail, setDetail] = useState<DiscoveryMenuItemDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadItem = useCallback(async () => {
    if (!id) return;
    try {
      const data = await discoveryApis.getMenuItem(id);
      setDetail(data);
      if (data.item.variations.length === 1) {
        setSelectedVariationId(data.item.variations[0].id);
      }
    } catch (error) {
      console.error("Failed to load item", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  const item = detail?.item;
  const selectedVariation = item?.variations.find(
    (v) => v.id === selectedVariationId,
  );

  const unitPrice = useMemo(() => {
    if (selectedVariation) {
      return selectedVariation.discountPrice ?? selectedVariation.price;
    }
    return item?.discountPrice ?? item?.price ?? 0;
  }, [item, selectedVariation]);

  const total = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!item) return;

    if (item.variations.length > 0 && !selectedVariationId) {
      Alert.alert("Choose a size", "Please select a variation before adding to cart.");
      return;
    }

    addItem({
      itemId: item.id,
      name: item.name,
      branchId: branchId ?? item.branchId,
      restaurantId: item.restaurantId ?? "",
      restaurantName: item.restaurantName ?? "",
      quantity,
      unitPrice,
      variationId: selectedVariation?.id,
      variationLabel: selectedVariation?.size,
      image: item.image,
    });

    Alert.alert("Added to cart", `${quantity}x ${item.name} added.`, [
      { text: "Continue", style: "cancel" },
      { text: "Done", onPress: () => router.back() },
    ]);
  };

  const handleAddPairing = (pairing: DiscoveryMenuItem) => {
    addItem({
      itemId: pairing.id,
      name: pairing.name,
      branchId: pairing.branchId,
      restaurantId: pairing.restaurantId ?? "",
      restaurantName: pairing.restaurantName ?? "",
      quantity: 1,
      unitPrice: pairing.discountPrice ?? pairing.price,
      image: pairing.image,
    });
  };

  if (isLoading || !item) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F9FB]">
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white px-4 h-14 flex-row items-center border-b border-gray-100"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#2D2D2D" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-[#2D2D2D] mr-8">
          Customize
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="bg-white mx-4 mt-4 rounded-2xl overflow-hidden border border-gray-100">
          <View className="h-52 bg-gray-100">
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : null}
          </View>
          <View className="p-4">
            {item.restaurantName ? (
              <Text className="text-xs text-primary font-semibold mb-1">
                {item.restaurantName}
                {item.branchName ? ` · ${item.branchName}` : ""}
              </Text>
            ) : null}
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-2xl font-bold text-[#2D2D2D]">
                  {item.name}
                </Text>
                {item.description ? (
                  <Text className="text-sm text-[#9BA5B7] mt-2">
                    {item.description}
                  </Text>
                ) : null}
              </View>
              <View className="bg-primary/10 px-3 py-2 rounded-full">
                <Text className="text-primary font-bold">
                  {unitPrice.toFixed(2)} LE
                </Text>
              </View>
            </View>
          </View>
        </View>

        {item.variations.length > 0 ? (
          <View className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 p-4">
            <Text className="text-lg font-bold text-[#2D2D2D] mb-3">
              Choose Size
            </Text>
            {item.variations.map((variation) => {
              const isSelected = selectedVariationId === variation.id;
              const price = variation.discountPrice ?? variation.price;
              return (
                <TouchableOpacity
                  key={variation.id}
                  onPress={() => setSelectedVariationId(variation.id)}
                  className={`flex-row items-center justify-between py-3 border-b border-gray-50 ${
                    isSelected ? "bg-primary/5 -mx-2 px-2 rounded-xl" : ""
                  }`}
                >
                  <View>
                    <Text className="font-medium text-[#2D2D2D]">
                      {variation.size}
                    </Text>
                    <Text className="text-sm text-[#9BA5B7]">
                      {price.toFixed(2)} LE
                    </Text>
                  </View>
                  <View
                    className={`w-5 h-5 rounded-full border-2 ${
                      isSelected ? "border-primary bg-primary" : "border-gray-300"
                    }`}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {item.dietaryTags.length > 0 ? (
          <View className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 p-4">
            <Text className="text-lg font-bold text-[#2D2D2D] mb-3">
              Preferences
            </Text>
            {item.dietaryTags.map((tag) => (
              <View
                key={tag.id}
                className="flex-row items-center justify-between py-3 border-b border-gray-50"
              >
                <Text className="font-medium text-[#2D2D2D]">{tag.name}</Text>
                <Switch
                  value={!!selectedTags[tag.id]}
                  onValueChange={(value) =>
                    setSelectedTags((current) => ({
                      ...current,
                      [tag.id]: value,
                    }))
                  }
                  trackColor={{ true: "#1565C0" }}
                />
              </View>
            ))}
          </View>
        ) : null}

        {detail?.pairings?.length ? (
          <View className="mx-4">
            <PairingCarousel
              pairings={detail.pairings}
              onAdd={handleAddPairing}
            />
          </View>
        ) : null}
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex-row items-center gap-3"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <TouchableOpacity
          onPress={handleAddToCart}
          className="flex-1 bg-primary rounded-2xl py-4 items-center"
        >
          <Text className="text-white font-bold text-base">
            Add to Cart · {total.toFixed(2)} LE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
