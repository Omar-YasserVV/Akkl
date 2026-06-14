import React from "react";
import { Text, View } from "react-native";

type ProfileProgressBarProps = {
  currentPoints: number;
  nextTierPoints: number;
};

export function ProfileProgressBar({
  currentPoints,
  nextTierPoints,
}: ProfileProgressBarProps) {
  const progress = Math.min(currentPoints / nextTierPoints, 1);
  const remaining = Math.max(nextTierPoints - currentPoints, 0);

  return (
    <View className="w-full mb-2">
      <View className="h-2 bg-[#E8ECF4] rounded-full overflow-hidden mb-2">
        <View
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </View>
      <Text className="text-xs text-[#9BA5B7] text-center">
        {remaining > 0
          ? `${remaining} points to next level`
          : "You've reached the top tier!"}
      </Text>
    </View>
  );
}
