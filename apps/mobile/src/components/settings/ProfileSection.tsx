import React from "react";
import { Text, View } from "react-native";

type ProfileSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-xs font-semibold tracking-widest text-[#9BA5B7] mb-3 px-1">
        {title}
      </Text>
      <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm shadow-black/5">
        {children}
      </View>
    </View>
  );
}
