import { TableHeader } from "@/components/dine-in/table-header";
import { useCart } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type OrderStage = "received" | "preparing" | "ready";

const STAGE_ORDER: OrderStage[] = ["received", "preparing", "ready"];

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function DineInOrderStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lastOrder, tableNumber } = useCart();
  const [stage, setStage] = useState<OrderStage>("received");
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          setStage((prev) => {
            const index = STAGE_ORDER.indexOf(prev);
            if (index < STAGE_ORDER.length - 1) {
              return STAGE_ORDER[index + 1];
            }
            return prev;
          });
          return 15;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const statusMessage = useMemo(() => {
    if (stage === "ready") return "Your order is ready!";
    if (stage === "preparing") return "Chef is Preparing...";
    return "Order Received";
  }, [stage]);

  const orderId = lastOrder?.id ?? "AKL-77492";
  const table = tableNumber ?? lastOrder?.tableNumber ?? "5";
  const placedAt = lastOrder?.placedAt ?? new Date();

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <View style={{ paddingTop: insets.top }}>
        <TableHeader showBranch={false} />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[32px] font-extrabold text-[#171B20] mt-4">
          Order Received
        </Text>
        <Text className="text-[16px] text-[#5A6270] mt-2">
          Order #{orderId} · Table #{table}
        </Text>

        <View className="mt-6 rounded-[12px] bg-[#EBF2FF] border border-[#C5D9FF] p-5 flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-[#065FCC] items-center justify-center">
            <Ionicons name="restaurant" size={24} color="#FFFFFF" />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-[17px] font-bold text-[#065FCC]">
              {statusMessage}
            </Text>
            {stage !== "ready" ? (
              <Text className="text-[14px] text-[#5A6270] mt-1">
                Updating status in {countdown}s...
              </Text>
            ) : (
              <Text className="text-[14px] text-[#5A6270] mt-1">
                We&apos;ll bring it to Table #{table}
              </Text>
            )}
          </View>
        </View>

        <View className="mt-8">
          <TimelineStep
            title="Order Received"
            subtitle={formatTime(placedAt)}
            active
            completed
            icon="checkmark-circle"
          />
          <TimelineConnector active={stage !== "received"} />
          <TimelineStep
            title="Preparing"
            subtitle={
              stage === "preparing" || stage === "ready"
                ? "Estimated 10–15 mins"
                : "Waiting to start"
            }
            active={stage === "preparing" || stage === "ready"}
            completed={stage === "ready"}
            icon="flame-outline"
          />
          <TimelineConnector active={stage === "ready"} />
          <TimelineStep
            title="Ready to Serve"
            subtitle={`We'll bring it to Table #${table}`}
            active={stage === "ready"}
            completed={stage === "ready"}
            icon="hand-left-outline"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/dine-in/menu" as Href)}
          activeOpacity={0.9}
          className="mt-10 h-[56px] rounded-[12px] border-2 border-[#065FCC] bg-white items-center justify-center"
        >
          <Text className="text-[17px] font-bold text-[#065FCC]">
            Return to Menu
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function TimelineStep({
  title,
  subtitle,
  active,
  completed,
  icon,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  completed: boolean;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const color = active ? "#065FCC" : "#C5CAD3";
  const textColor = active ? "#1A1A1A" : "#9BA5B7";

  return (
    <View className="flex-row items-start">
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${
          active ? "bg-[#065FCC]" : "bg-[#E8EBF0]"
        }`}
      >
        <Ionicons
          name={completed && icon === "checkmark-circle" ? "checkmark" : icon}
          size={20}
          color={active ? "#FFFFFF" : "#9BA5B7"}
        />
      </View>
      <View className="ml-4 flex-1 pt-1">
        <Text className={`text-[17px] font-bold ${active ? "text-[#1A1A1A]" : "text-[#9BA5B7]"}`}>
          {title}
        </Text>
        <Text className={`text-[14px] mt-0.5 ${textColor === "#1A1A1A" ? "text-[#5A6270]" : "text-[#9BA5B7]"}`}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

function TimelineConnector({ active }: { active: boolean }) {
  return (
    <View
      className="w-10 items-center py-1"
      style={{ marginLeft: 0 }}
    >
      <View
        className={`w-0.5 h-8 ${active ? "bg-[#065FCC]" : "bg-[#E8EBF0]"}`}
      />
    </View>
  );
}
