import { PaymentMethodCard } from "@/components/settings/PaymentMethodCard";
import { PrimaryButton } from "@/components/settings/PrimaryButton";
import { SecurityBanner } from "@/components/settings/SecurityBanner";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { BottomTabInset } from "@/constants/theme";
import { usePaymentMethods } from "@/hooks/settings/usePaymentMethods";
import { appHref } from "@/lib/navigation";
import { SETTINGS_ROUTES } from "@/lib/settings-routes";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { methods, removeMethod, setDefaultMethod } = usePaymentMethods();

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <SettingsHeader title="Akkl" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: BottomTabInset + insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[16px] font-extrabold text-[#0066D9] mb-4">
          Manage Wallets
        </Text>
        <SecurityBanner />

        <Text className="text-[11px] font-bold text-[#8B95A4] tracking-widest mb-3 mt-1">
          SAVED METHODS
        </Text>

        {methods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            onRemove={() => removeMethod(method.id)}
            onSetDefault={() => setDefaultMethod(method.id)}
          />
        ))}

        <PrimaryButton
          label="+ Add New Payment Method"
          onPress={() => router.push(appHref(SETTINGS_ROUTES.addPaymentMethod))}
          className="mt-3"
        />
      </ScrollView>
    </View>
  );
}
