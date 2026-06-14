import {
  PaymentMethodOption,
} from "@/components/settings/PaymentMethodOption";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { BottomTabInset } from "@/constants/theme";
import { appHref } from "@/lib/navigation";
import { SETTINGS_ROUTES } from "@/lib/settings-routes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <SettingsHeader title="Add Payment Method" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: BottomTabInset + insets.bottom + 24,
        }}
      >
        <View className="bg-[#0066D9] rounded-xl p-5 mb-5">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full border border-white/40 items-center justify-center mr-3">
              <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-extrabold text-white/80 tracking-widest">
                SECURED TRANSACTION
              </Text>
              <Text className="text-[12px] text-white mt-1 leading-4">
                Your payment information is encrypted and protected by industry-standard SSL technology.
              </Text>
            </View>
          </View>
        </View>
        <Text className="text-[11px] font-bold text-[#8B95A4] tracking-widest mb-3">
          SELECT METHOD
        </Text>
        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <PaymentMethodOption
            icon="card-outline"
            title="Credit or Debit Card"
            description="Visa, Mastercard, and other major cards"
            onPress={() => router.push(appHref(SETTINGS_ROUTES.addCard))}
          />
          <PaymentMethodOption
            icon="wallet-outline"
            title="Digital Wallet"
            description="Apple Pay, Google Pay, Vodafone Cash"
            onPress={() => router.push(appHref(SETTINGS_ROUTES.connectWallet))}
          />
          <PaymentMethodOption
            icon="cash-outline"
            title="Cash on Delivery"
            description="Pay when your order arrives"
            onPress={() => router.back()}
            showBorder={false}
          />
        </View>

        <View className="flex-row justify-center gap-6 py-4">
          <Ionicons name="lock-closed" size={20} color="#9BA5B7" />
          <Ionicons name="shield-checkmark" size={20} color="#9BA5B7" />
          <Ionicons name="card" size={20} color="#9BA5B7" />
        </View>
        <Text className="text-center text-xs text-[#9BA5B7]">
          Your payment data is encrypted end-to-end
        </Text>
      </ScrollView>
    </View>
  );
}
