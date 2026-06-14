import { MEMBERSHIP_LABELS, MembershipTier } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type MembershipBadgeProps = {
  tier: MembershipTier;
};

export function MembershipBadge({ tier }: MembershipBadgeProps) {
  return (
    <View className="flex-row items-center bg-[#E3F2FD] rounded-full px-3 py-1.5">
      <View className="w-5 h-5 rounded-full bg-primary items-center justify-center mr-2">
        <Ionicons name="star" size={12} color="#fff" />
      </View>
      <Text className="text-xs font-bold tracking-wide text-primary">
        {MEMBERSHIP_LABELS[tier]}
      </Text>
    </View>
  );
}
