import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="order-history" />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="connect-wallet" />
      <Stack.Screen name="add-payment-method" />
      <Stack.Screen name="add-card" />
    </Stack>
  );
}
