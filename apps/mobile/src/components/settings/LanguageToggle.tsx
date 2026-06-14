import { LANGUAGE_LABELS, AppLanguage } from "@/types/settings";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type LanguageToggleProps = {
  value: AppLanguage;
  onChange: (language: AppLanguage) => void;
};

export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <View className="flex-row bg-[#F0F2F6] rounded-xl p-1">
      {(["en", "ar"] as AppLanguage[]).map((lang) => {
        const isActive = value === lang;
        return (
          <TouchableOpacity
            key={lang}
            onPress={() => onChange(lang)}
            className={`flex-1 py-2.5 rounded-lg items-center ${isActive ? "bg-white" : ""}`}
            activeOpacity={0.8}
          >
            <Text
              className={`text-sm font-semibold ${isActive ? "text-primary" : "text-[#9BA5B7]"}`}
            >
              {LANGUAGE_LABELS[lang]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
