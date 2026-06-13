import { PairingCarousel } from "@/components/discovery/pairing-carousel";
import { QuantityStepper } from "@/components/discovery/quantity-stepper";
import { useCartStore } from "@/stores/cart-store";
import {
  getDisplayPrice,
  getValidVariations,
  hasVariations,
} from "@/utils/menuItem";
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
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ItemCustomizeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, branchId } = useLocalSearchParams<{ id: string; branchId?: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const [detail, setDetail] = useState<DiscoveryMenuItemDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadItem = useCallback(async () => {
    if (!id) return;
    try {
      const data = await discoveryApis.getMenuItem(id);
      setDetail(data);
      const variations = getValidVariations(data.item);
      if (variations.length > 0) {
        setSelectedVariationId(variations[0].id);
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
  const variations = item ? getValidVariations(item) : [];
  const selectedVariation = variations.find(
    (v) => v.id === selectedVariationId,
  );

  const unitPrice = useMemo(() => {
    if (selectedVariation) {
      return selectedVariation.discountPrice ?? selectedVariation.price;
    }
    return item ? getDisplayPrice(item) : 0;
  }, [item, selectedVariation]);

  const total = unitPrice * quantity;

  const isButtonDisabled = item ? hasVariations(item) && !selectedVariationId : true;
  const buttonText = isButtonDisabled
    ? "Select a Size"
    : `Add to Cart · ${total.toFixed(2)} LE`;

  const handleAddToCart = () => {
    if (!item || isButtonDisabled) return;

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

    router.back();
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

        {variations.length > 0 ? (
          <View className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 p-4">
            <Text className="text-lg font-bold text-[#2D2D2D] mb-3">
              Choose Size
            </Text>
            {variations.map((variation) => {
              const isSelected = selectedVariationId === variation.id;
              const price = variation.discountPrice ?? variation.price;
              return (
                <TouchableOpacity
                  key={variation.id}
                  onPress={() => setSelectedVariationId(variation.id)}
                  className={`flex-row items-center justify-between py-3.5 px-3 mb-2 rounded-xl border ${
                    isSelected ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
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
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                      isSelected ? "border-primary" : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
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
          disabled={isButtonDisabled}
          className={`flex-1 rounded-2xl py-4 items-center ${
            isButtonDisabled ? "bg-gray-300" : "bg-primary"
          }`}
        >
          <Text className="text-white font-bold text-base">
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
