import { PrimaryButton } from "@/components/settings/PrimaryButton";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { WalletOptionTile } from "@/components/settings/WalletOptionTile";
import { WALLET_OPTIONS } from "@/components/settings/PaymentMethodOption";
import { BottomTabInset } from "@/constants/theme";
import { usePaymentMethods } from "@/hooks/settings/usePaymentMethods";
import { appHref } from "@/lib/navigation";
import { SETTINGS_ROUTES } from "@/lib/settings-routes";
import { PaymentMethodType } from "@/types/payment";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConnectWalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { connectWallet } = usePaymentMethods();

  const handleSelect = (type: PaymentMethodType) => {
    if (type === "visa" || type === "mastercard") {
      router.push(appHref(SETTINGS_ROUTES.addCard));
      return;
    }
    connectWallet(type);
    router.back();
  };

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <SettingsHeader title="Akkl" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: BottomTabInset + insets.bottom + 24,
        }}
      >
        <Text className="text-[22px] font-extrabold text-[#20242A] mb-2">
          Connect Wallet
        </Text>
        <Text className="text-[12px] text-[#697386] mb-5 leading-5">
          Select your preferred payment method to link your account and enjoy faster checkout in LE.
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {WALLET_OPTIONS.map((option) => (
            <WalletOptionTile
              key={option.type}
              option={option}
              onPress={() => handleSelect(option.type)}
            />
          ))}
        </View>

        <PrimaryButton
          label="Continue"
          onPress={() => router.push(appHref(SETTINGS_ROUTES.paymentMethods))}
          className="mt-3"
        />
      </ScrollView>
    </View>
  );
}
