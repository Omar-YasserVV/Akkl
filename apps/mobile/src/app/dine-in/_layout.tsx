import { Stack } from "expo-router";

export default function DineInLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="scan" />
      <Stack.Screen name="menu" />
      <Stack.Screen name="cart" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="order-status" />
    </Stack>
  );
}
