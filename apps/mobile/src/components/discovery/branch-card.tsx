import type { DiscoveryBranch } from "@repo/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface BranchCardProps {
  branch: DiscoveryBranch;
  onSelect: () => void;
  primary?: boolean;
}

function OpenBadge({ status }: { status: string }) {
  const bgClass =
    status === "OPEN"
      ? "bg-green-100"
      : status === "CLOSING_SOON"
        ? "bg-orange-100"
        : "bg-gray-100";
  const textClass =
    status === "OPEN"
      ? "text-green-700"
      : status === "CLOSING_SOON"
        ? "text-orange-700"
        : "text-gray-600";

  return (
    <View className={`px-2 py-1 rounded-full ${bgClass}`}>
      <Text className={`text-xs font-semibold ${textClass}`}>
        {status.replace("_", " ")}
      </Text>
    </View>
  );
}

export function BranchCard({ branch, onSelect, primary }: BranchCardProps) {
  return (
    <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-3">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center gap-2 flex-1">
          <OpenBadge status={branch.openStatus} />
          {branch.openUntil ? (
            <Text className="text-xs text-[#9BA5B7]">
              Until {branch.openUntil}
            </Text>
          ) : null}
        </View>
        <View className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden">
          {branch.restaurant.logoUrl ? (
            <Image
              source={{ uri: branch.restaurant.logoUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center mb-1">
        {branch.restaurant.logoUrl ? (
          <Image
            source={{ uri: branch.restaurant.logoUrl }}
            style={{ width: 20, height: 20, borderRadius: 10, marginRight: 8 }}
          />
        ) : null}
        <Text className="text-xs text-primary font-medium">
          {branch.restaurant.name}
        </Text>
      </View>

      <Text className="text-lg font-bold text-[#2D2D2D]">{branch.name}</Text>

      {branch.distanceKm != null ? (
        <View className="flex-row items-center mt-1">
          <Ionicons name="navigate-outline" size={14} color="#9BA5B7" />
          <Text className="text-sm text-[#9BA5B7] ml-1">
            {branch.distanceKm.toFixed(1)} km away
          </Text>
        </View>
      ) : null}

      {branch.address ? (
        <Text className="text-sm text-[#9BA5B7] mt-2">{branch.address}</Text>
      ) : null}

      <View className="flex-row justify-end mt-4">
        <TouchableOpacity
          onPress={onSelect}
          className={`px-5 py-2.5 rounded-xl ${
            primary ? "bg-primary" : "bg-primary/10"
          }`}
        >
          <Text
            className={`font-semibold ${primary ? "text-white" : "text-primary"}`}
          >
            Select
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
