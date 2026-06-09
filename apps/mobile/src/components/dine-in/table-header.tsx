import { useCart } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface TableHeaderProps {
  showBranch?: boolean;
}

export function TableHeader({ showBranch = true }: TableHeaderProps) {
  const { branchName, tableNumber } = useCart();

  return (
    <View className="bg-white px-5 pt-2 pb-4 border-b border-[#E8EBF0]">
      {showBranch ? (
        <Text className="text-[22px] font-bold text-[#171B20]">
          {branchName ?? "Downtown Branch"}
        </Text>
      ) : null}
      <View className="flex-row items-center mt-1">
        <Ionicons name="restaurant-outline" size={18} color="#065FCC" />
        <Text className="ml-2 text-[16px] font-semibold text-[#065FCC]">
          Serving to Table #{tableNumber ?? "—"}
        </Text>
      </View>
    </View>
  );
}
