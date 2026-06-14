import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SettingsHeaderProps = {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  leftAction?: React.ReactNode;
};

export function SettingsHeader({
  title,
  showBack = true,
  rightAction,
  leftAction,
}: SettingsHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 h-12">
        {leftAction ? (
          <View className="w-10 items-start justify-center -ml-2">{leftAction}</View>
        ) : showBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center -ml-2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={21} color="#0066D9" />
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
        <Text className="text-[15px] font-extrabold text-[#0066D9]">{title}</Text>
        <View className="w-10 items-center justify-center -mr-2">
          {rightAction}
        </View>
      </View>
    </View>
  );
}
