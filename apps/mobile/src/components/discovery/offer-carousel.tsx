import type { DiscoveryMenuItem } from "@repo/utils";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface OfferCarouselProps {
  offers: DiscoveryMenuItem[];
  onPress: (item: DiscoveryMenuItem) => void;
}

export function OfferCarousel({ offers, onPress }: OfferCarouselProps) {
  if (!offers.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {offers.map((offer) => {
        const discount =
          offer.discountPrice && offer.price
            ? Math.round((1 - offer.discountPrice / offer.price) * 100)
            : 20;

        return (
          <TouchableOpacity
            key={offer.id}
            onPress={() => onPress(offer)}
            className="w-72 mr-3 rounded-2xl overflow-hidden"
            activeOpacity={0.9}
          >
            <View className="bg-primary p-4 min-h-[140px] justify-between">
              <View className="flex-row items-center mb-2">
                {offer.restaurantLogoUrl ? (
                  <Image
                    source={{ uri: offer.restaurantLogoUrl }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      marginRight: 8,
                    }}
                  />
                ) : null}
                <Text className="text-white/90 text-xs font-medium flex-1">
                  {offer.restaurantName}
                </Text>
                <View className="bg-white/20 px-2 py-1 rounded-full">
                  <Text className="text-white text-[10px] font-bold">
                    {offer.badge ?? "OFFER"}
                  </Text>
                </View>
              </View>
              <Text className="text-white text-xl font-bold">
                {discount}% Off {offer.name}
              </Text>
              <Text className="text-white/80 text-sm mt-1">
                {offer.subtitle ?? `Now ${offer.discountPrice?.toFixed(2)} LE`}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
