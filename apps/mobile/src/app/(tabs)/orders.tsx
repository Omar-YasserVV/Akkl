import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOrders } from "../../orders/hooks/Orders";
import { OrdersList } from "../../orders/orders";

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();

  const { data: response, isLoading } = useOrders({
    page: 1,
    limit: 20,
  });
  console.log(response);

  const orders = response?.data ?? [];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F8F9FA",
        paddingTop: insets.top + 10,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "#171B20",
          paddingHorizontal: 16,
        }}
      >
        Orders
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#5F6368",
          paddingHorizontal: 16,

          marginBottom: 16,
        }}
      >
        Orders you ordered from App and Shop
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#171B20" style={{ flex: 1 }} />
      ) : (
        <OrdersList orders={orders} />
      )}
    </View>
  );
}
