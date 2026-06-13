import { TableHeader } from "@/components/dine-in/table-header";
import { formatPrice } from "@/constants/dine-in";
import { useCart } from "@/context/cart-context";
import { useTrackedOrder } from "@/orders/hooks/Orders";
import type { OrderStatus } from "@/orders/types/PaginatedResponse";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type OrderStage = "received" | "preparing" | "ready" | "cancelled";

function formatTime(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function getStageFromStatus(status: OrderStatus): OrderStage {
  if (status === "COMPLETED") return "ready";
  if (status === "CANCELLED") return "cancelled";
  if (status === "IN_PROGRESS") return "preparing";
  return "received";
}

function getHeaderTitle(status: OrderStatus): string {
  if (status === "COMPLETED") return "Order Ready";
  if (status === "CANCELLED") return "Order Cancelled";
  if (status === "IN_PROGRESS") return "Chef is Preparing";
  return "Order Received";
}

function getStatusMessage(status: OrderStatus): string {
  if (status === "COMPLETED") return "Your order is ready!";
  if (status === "CANCELLED") return "This order was cancelled.";
  if (status === "IN_PROGRESS") return "Chef is preparing your meal...";
  return "We've received your order.";
}

export default function DineInOrderStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lastOrder, tableNumber, branchName } = useCart();

  const { data: trackedOrder, isLoading, isFetching } = useTrackedOrder(
    lastOrder?.id !== "—" ? lastOrder?.id : undefined,
    lastOrder?.orderNumber || undefined,
  );

  const status = trackedOrder?.status ?? "IN_PROGRESS";
  const stage = getStageFromStatus(status);

  const orderNumber =
    trackedOrder?.orderNumber ?? lastOrder?.orderNumber ?? null;
  const orderLabel = orderNumber ? `#${orderNumber}` : "—";
  const table = tableNumber ?? lastOrder?.tableNumber ?? "—";
  const placedAt = trackedOrder?.createdAt ?? lastOrder?.placedAt ?? new Date();
  const total = trackedOrder
    ? parseFloat(trackedOrder.totalPrice)
    : (lastOrder?.total ?? 0);
  const items = trackedOrder?.items ?? [];

  const statusMessage = useMemo(() => getStatusMessage(status), [status]);
  const headerTitle = useMemo(() => getHeaderTitle(status), [status]);

  const isPreparingActive = stage === "preparing";
  const isReadyActive = stage === "ready";
  const isCancelled = stage === "cancelled";

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
          {headerTitle}
        </Text>
        <Text className="text-[16px] text-[#5A6270] mt-2">
          Order {orderLabel} · Table #{table}
        </Text>
        {branchName ? (
          <Text className="text-[14px] text-[#858C9B] mt-1">{branchName}</Text>
        ) : null}

        <View
          className={`mt-6 rounded-[12px] border p-5 flex-row items-center ${
            isCancelled
              ? "bg-[#FFF1F0] border-[#FFCCC7]"
              : "bg-[#EBF2FF] border-[#C5D9FF]"
          }`}
        >
          <View
            className={`w-12 h-12 rounded-full items-center justify-center ${
              isCancelled ? "bg-[#D83A32]" : "bg-[#065FCC]"
            }`}
          >
            <Ionicons
              name={isCancelled ? "close-circle" : "restaurant"}
              size={24}
              color="#FFFFFF"
            />
          </View>
          <View className="flex-1 ml-4">
            <Text
              className={`text-[17px] font-bold ${
                isCancelled ? "text-[#D83A32]" : "text-[#065FCC]"
              }`}
            >
              {statusMessage}
            </Text>
            {!isCancelled && stage !== "ready" ? (
              <View className="flex-row items-center mt-1">
                {isFetching ? (
                  <ActivityIndicator size="small" color="#065FCC" />
                ) : null}
                <Text className="text-[14px] text-[#5A6270] ml-1">
                  {isFetching ? "Updating status..." : "Status updates every few seconds"}
                </Text>
              </View>
            ) : stage === "ready" ? (
              <Text className="text-[14px] text-[#5A6270] mt-1">
                We&apos;ll bring it to Table #{table}
              </Text>
            ) : null}
          </View>
        </View>

        {isLoading && !trackedOrder ? (
          <View className="mt-8 items-center py-6">
            <ActivityIndicator size="large" color="#065FCC" />
            <Text className="text-[14px] text-[#5A6270] mt-3">
              Loading order details...
            </Text>
          </View>
        ) : (
          <>
            {items.length > 0 ? (
              <View className="mt-6 rounded-[12px] bg-white border border-[#E8EBF0] p-4">
                <Text className="text-[15px] font-bold text-[#171B20] mb-3">
                  Order Summary
                </Text>
                {items.map((item) => (
                  <View
                    key={item.id}
                    className="flex-row justify-between mb-2 last:mb-0"
                  >
                    <Text className="text-[14px] text-[#5A6270] flex-1 pr-3">
                      {item.quantity}x {item.branchMenuItem.name}
                    </Text>
                    <Text className="text-[14px] font-semibold text-[#171B20]">
                      {formatPrice(parseFloat(item.totalPrice))}
                    </Text>
                  </View>
                ))}
                <View className="h-px bg-[#E8EBF0] my-3" />
                <View className="flex-row justify-between">
                  <Text className="text-[15px] font-bold text-[#171B20]">
                    Total
                  </Text>
                  <Text className="text-[15px] font-extrabold text-[#065FCC]">
                    {formatPrice(total)}
                  </Text>
                </View>
              </View>
            ) : null}

            <View className="mt-8">
              <TimelineStep
                title="Order Received"
                subtitle={formatTime(placedAt)}
                active
                completed={!isCancelled}
                icon="checkmark-circle"
              />
              <TimelineConnector active={isPreparingActive || isReadyActive} />
              <TimelineStep
                title="Preparing"
                subtitle={
                  isReadyActive
                    ? "Completed"
                    : isPreparingActive
                      ? "In progress"
                      : "Waiting to start"
                }
                active={isPreparingActive || isReadyActive}
                completed={isReadyActive}
                icon="flame-outline"
              />
              <TimelineConnector active={isReadyActive} />
              <TimelineStep
                title="Ready to Serve"
                subtitle={
                  isReadyActive
                    ? `We'll bring it to Table #${table}`
                    : isCancelled
                      ? "Order cancelled"
                      : "Waiting for kitchen"
                }
                active={isReadyActive}
                completed={isReadyActive}
                icon="hand-left-outline"
              />
            </View>
          </>
        )}

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
        <Text
          className={`text-[17px] font-bold ${
            active ? "text-[#1A1A1A]" : "text-[#9BA5B7]"
          }`}
        >
          {title}
        </Text>
        <Text
          className={`text-[14px] mt-0.5 ${
            active ? "text-[#5A6270]" : "text-[#9BA5B7]"
          }`}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

function TimelineConnector({ active }: { active: boolean }) {
  return (
    <View className="w-10 items-center py-1">
      <View
        className={`w-0.5 h-8 ${active ? "bg-[#065FCC]" : "bg-[#E8EBF0]"}`}
      />
    </View>
  );
}
