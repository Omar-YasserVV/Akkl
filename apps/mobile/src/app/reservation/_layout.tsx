import { Stack } from "expo-router";
import React from "react";

export default function ReservationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="details" />
      <Stack.Screen name="confirmation" />
      <Stack.Screen name="status" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="result" />
    </Stack>
  );
}
