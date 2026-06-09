import type { DiscoveryMenuItem } from "@repo/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface PairingCarouselProps {
  pairings: DiscoveryMenuItem[];
  onAdd: (item: DiscoveryMenuItem) => void;
}

export function PairingCarousel({ pairings, onAdd }: PairingCarouselProps) {
  if (!pairings.length) return null;

  return (
    <View className="bg-primary/5 -mx-4 px-4 py-4 mt-4">
      <Text className="text-xs font-bold tracking-widest text-primary mb-3">
        RECOMMENDED PAIRINGS
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {pairings.map((item) => (
          <View
            key={item.id}
            className="w-36 bg-white rounded-2xl border border-gray-100 p-3 mr-3"
          >
            <View className="w-full h-20 rounded-xl bg-gray-100 overflow-hidden mb-2">
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              ) : null}
            </View>
            <Text className="text-sm font-medium text-[#2D2D2D]" numberOfLines={2}>
              {item.name}
            </Text>
            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-sm font-bold text-primary">
                {(item.discountPrice ?? item.price).toFixed(2)} LE
              </Text>
              <TouchableOpacity
                onPress={() => onAdd(item)}
                className="w-7 h-7 rounded-full bg-primary items-center justify-center"
              >
                <Ionicons name="add" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
