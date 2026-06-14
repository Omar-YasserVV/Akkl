import React from "react";
import { Text, View } from "react-native";

type SettingsGroupProps = {
  title?: string;
  children: React.ReactNode;
};

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  return (
    <View className="mb-5">
      {title ? (
        <Text className="text-[13px] font-bold text-[#636B76] mb-2 px-1">
          {title}
        </Text>
      ) : null}
      <View className="bg-white rounded-xl border border-[#EEF0F3] overflow-hidden">
        {children}
      </View>
    </View>
  );
}
