import { CardPreview } from "@/components/settings/CardPreview";
import { FormField } from "@/components/settings/FormField";
import { PrimaryButton } from "@/components/settings/PrimaryButton";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { BottomTabInset } from "@/constants/theme";
import { usePaymentMethods } from "@/hooks/settings/usePaymentMethods";
import { appHref } from "@/lib/navigation";
import { SETTINGS_ROUTES } from "@/lib/settings-routes";
import { CardFormValues } from "@/types/payment";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const INITIAL_FORM: CardFormValues = {
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  saveForFuture: true,
};

export default function AddCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addCard } = usePaymentMethods();
  const [form, setForm] = useState<CardFormValues>(INITIAL_FORM);

  const updateField = <K extends keyof CardFormValues>(
    key: K,
    value: CardFormValues[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = () => {
    addCard(form);
    router.replace(appHref(SETTINGS_ROUTES.paymentMethods));
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
        <Text className="text-[24px] font-extrabold text-[#20242A] mb-4">
          Add New Card
        </Text>
        <CardPreview
          cardholderName={form.cardholderName}
          cardNumber={form.cardNumber}
          expiryDate={form.expiryDate}
        />

        <FormField
          label="Cardholder Name"
          value={form.cardholderName}
          onChangeText={(value) => updateField("cardholderName", value)}
          placeholder="Name on card"
        />
        <FormField
          label="Card Number"
          value={form.cardNumber}
          onChangeText={(value) => updateField("cardNumber", value)}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
        />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <FormField
              label="Expiry Date"
              value={form.expiryDate}
              onChangeText={(value) => updateField("expiryDate", value)}
              placeholder="MM/YY"
            />
          </View>
          <View className="flex-1">
            <FormField
              label="CVV"
              value={form.cvv}
              onChangeText={(value) => updateField("cvv", value)}
              placeholder="123"
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-6 px-1">
          <Text className="text-sm font-medium text-[#2D2D2D]">
            Save card for future payments
          </Text>
          <Switch
            value={form.saveForFuture}
            onValueChange={(value) => updateField("saveForFuture", value)}
            trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
            thumbColor={form.saveForFuture ? "#0057C0" : "#F9FAFB"}
          />
        </View>

        <View className="flex-row justify-center gap-5 mb-4">
          <Text className="text-[10px] font-bold text-[#9BA5B7]">SSL SECURE</Text>
          <Text className="text-[10px] font-bold text-[#9BA5B7]">PCI DSS</Text>
        </View>

        <PrimaryButton label="Add Card & Pay Securely" onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
}
