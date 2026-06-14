import { LanguageToggle } from "@/components/settings/LanguageToggle";
import { PrimaryButton } from "@/components/settings/PrimaryButton";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import {
  SettingsLinkRow,
  SettingsToggleRow,
} from "@/components/settings/SettingsToggleRow";
import { BottomTabInset } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useSession } from "@/context/session-context";
import { useAppSettings } from "@/hooks/settings/useAppSettings";
import { appHref } from "@/lib/navigation";
import { APP_VERSION } from "@/types/settings";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout, isLoading } = useAuth();
  const { clearSession } = useSession();
  const {
    language,
    notificationsEnabled,
    biometricLoginEnabled,
    setLanguage,
    toggleNotifications,
    toggleBiometricLogin,
  } = useAppSettings();

  const handleLogout = async () => {
    await clearSession();
    await logout();
  };

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <SettingsHeader
        title="Akkl"
        rightAction={<Ionicons name="search" size={19} color="#1F2937" />}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: BottomTabInset + insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[16px] font-bold text-[#20242A] mb-4">Preferences</Text>

        <SettingsGroup title="">
          <View className="px-4 py-3 border-b border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-[#EAF3FF] items-center justify-center mr-3">
                <Ionicons name="globe-outline" size={17} color="#0066D9" />
              </View>
              <Text className="text-[13px] font-bold text-[#2D2D2D]">
              Language
              </Text>
            </View>
            <LanguageToggle value={language} onChange={setLanguage} />
          </View>
          <SettingsToggleRow
            icon="notifications-outline"
            label="Push Notifications"
            description="Stay updated on your orders"
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            showBorder={false}
          />
        </SettingsGroup>

        <Text className="text-[16px] font-bold text-[#20242A] mb-4 mt-1">Security</Text>
        <SettingsGroup title="">
          <SettingsLinkRow
            icon="key-outline"
            label="Change Password"
            onPress={() => router.push(appHref("/(auth)/sign-in"))}
          />
          <SettingsToggleRow
            icon="finger-print-outline"
            label="Biometric Login"
            value={biometricLoginEnabled}
            onValueChange={toggleBiometricLogin}
            showBorder={false}
          />
        </SettingsGroup>

        <Text className="text-[16px] font-bold text-[#20242A] mb-4 mt-1">About</Text>
        <SettingsGroup title="">
          <SettingsLinkRow
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => Linking.openURL("https://example.com/terms")}
          />
          <SettingsLinkRow
            icon="shield-outline"
            label="Privacy Policy"
            onPress={() => Linking.openURL("https://example.com/privacy")}
          />
          <SettingsLinkRow
            icon="information-circle-outline"
            label="Version"
            value={APP_VERSION}
            showBorder={false}
          />
        </SettingsGroup>

        <PrimaryButton
          label="Logout"
          variant="danger"
          onPress={handleLogout}
          loading={isLoading}
          className="mt-1"
        />
      </ScrollView>
    </View>
  );
}
