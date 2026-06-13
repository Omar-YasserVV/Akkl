import type { DiscoveryMenuItem } from "@repo/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useRef } from "react";
import { Animated, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface PairingCarouselProps {
  pairings: DiscoveryMenuItem[];
  selectedIds: string[];
  onToggle: (item: DiscoveryMenuItem) => void;
}

export function PairingCarousel({ pairings, selectedIds, onToggle }: PairingCarouselProps) {
  if (!pairings.length) return null;

  return (
    <View className="bg-primary/5 -mx-4 px-4 py-4 mt-4">
      <Text className="text-xs font-bold tracking-widest text-primary mb-3">
        RECOMMENDED PAIRINGS
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {pairings.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <PairingCard
              key={item.id}
              item={item}
              isSelected={isSelected}
              onToggle={onToggle}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

interface PairingCardProps {
  item: DiscoveryMenuItem;
  isSelected: boolean;
  onToggle: (item: DiscoveryMenuItem) => void;
}

function PairingCard({ item, isSelected, onToggle }: PairingCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    onToggle(item);

    // Spring scale feedback animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.15,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.0,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      className={`w-36 bg-white rounded-2xl border p-3 mr-3 ${
        isSelected ? "border-primary bg-primary/5" : "border-gray-100"
      }`}
      style={{ transform: [{ scale: scaleAnim }] }}
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
          onPress={handlePress}
          className={`w-7 h-7 rounded-full items-center justify-center ${
            isSelected ? "bg-green-500" : "bg-primary"
          }`}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isSelected ? "checkmark" : "add"}
            size={16}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
