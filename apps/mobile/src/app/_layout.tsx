import { AuthProvider, useAuth } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { LocationProvider } from "@/context/location-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function NavigationTree() {
  const { isLoading } = useAuth();
  const colorScheme = useColorScheme();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-900">
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="search" />
          <Stack.Screen name="pickup" />
          <Stack.Screen name="dine-in" />
          <Stack.Screen name="restaurant/[id]" />
          <Stack.Screen name="item/[id]" />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    // 3. Place QueryClientProvider at the absolute root wrapper.
    // This allows Location, Cart, and Auth contexts to use React Query hooks if needed!
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <CartProvider>
          <AuthProvider>
            <NavigationTree />
          </AuthProvider>
        </CartProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
}
