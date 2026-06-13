import { useCart } from "@/context/cart-context";
import { useTrackedOrder } from "@/orders/hooks/Orders";
import {
  getEstimatedPrepMinutes,
  getPickupStageFromStatus,
  getPickupStatusSubtitle,
  getPickupStatusTitle,
} from "@/orders/utils/orderStatus";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const formatPrice = (price: number) => `${price.toFixed(2)} LE`;

export default function PickupOrderStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lastOrder, branchName, clearCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const {
    data: trackedOrder,
    isLoading,
    isFetching,
  } = useTrackedOrder(
    lastOrder?.id !== "—" ? lastOrder?.id : undefined,
    lastOrder?.orderNumber || undefined,
  );

  const status = trackedOrder?.status ?? "IN_PROGRESS";
  const stage = getPickupStageFromStatus(status);
  const orderItems = useMemo(
    () => trackedOrder?.items ?? [],
    [trackedOrder?.items],
  );
  const orderNumber =
    trackedOrder?.orderNumber ?? lastOrder?.orderNumber ?? null;
  const orderLabel = orderNumber ? `#${orderNumber}` : "—";
  const displayBranchName =
    trackedOrder?.branch?.name ?? branchName ?? "Branch";
  const paymentMethod = lastOrder?.paymentMethod ?? "—";
  const orderTotal = trackedOrder
    ? parseFloat(trackedOrder.totalPrice)
    : (lastOrder?.total ?? 0);
  const estimatedMinutes = useMemo(
    () => getEstimatedPrepMinutes(orderItems),
    [orderItems],
  );
  const statusTitle = useMemo(() => getPickupStatusTitle(status), [status]);
  const statusSubtitle = useMemo(
    () => getPickupStatusSubtitle(status, estimatedMinutes),
    [status, estimatedMinutes],
  );

  const isConfirmedDone = stage !== "confirmed" && stage !== "cancelled";
  const isPreparingActive = stage === "preparing";
  const isPreparingDone = stage === "ready";
  const isReadyActive = stage === "ready";
  const isCancelled = stage === "cancelled";

  const toggleDetails = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDetails(!showDetails);
  };

  const handleReturnHome = () => {
    clearCart();
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white px-5 pb-4 border-b border-[#E8EBF0] flex-row items-center justify-between"
      >
        <TouchableOpacity onPress={handleReturnHome} className="p-1">
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-[#1A1A1A]">
          {displayBranchName}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-2xl border border-[#E8EBF0] p-5 items-center mb-4">
          <Text className="text-[12px] font-bold text-[#065FCC] uppercase tracking-wider">
            Order Status
          </Text>
          <Text className="text-[24px] font-extrabold text-[#171B20] mt-1.5 text-center">
            {statusTitle}
          </Text>
          <Text
            className={`text-[14px] font-semibold mt-1 text-center ${
              isReadyActive
                ? "text-[#128A4D]"
                : isCancelled
                  ? "text-[#D83A32]"
                  : "text-[#5A6270]"
            }`}
          >
            {statusSubtitle}
          </Text>
          {!isCancelled && stage !== "ready" ? (
            <View className="flex-row items-center mt-2">
              {isFetching ? (
                <ActivityIndicator size="small" color="#065FCC" />
              ) : null}
              <Text className="text-[12px] text-[#858C9B] ml-1">
                {isFetching ? "Updating..." : "Live status from kitchen"}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="bg-white rounded-2xl border border-[#E8EBF0] p-5 mb-4">
          <View className="flex-row items-center justify-between px-3">
            <ProgressStep
              label="Confirmed"
              active={stage === "confirmed" || isConfirmedDone || isReadyActive}
              completed={isConfirmedDone || isReadyActive}
              icon="checkmark"
            />

            <ProgressLine active={isPreparingActive || isPreparingDone} />

            <ProgressStep
              label="Preparing"
              active={isPreparingActive || isPreparingDone}
              completed={isPreparingDone}
              icon="restaurant"
              current={isPreparingActive}
            />

            <ProgressLine active={isReadyActive} />

            <ProgressStep
              label="Ready"
              active={isReadyActive}
              completed={isReadyActive}
              icon="gift-outline"
            />
          </View>
        </View>

        <View className="bg-white rounded-2xl border border-[#E8EBF0] p-6 items-center mb-4">
          <Text className="text-[14px] font-bold text-[#6E7682] mb-4 text-center">
            Show this code at pick-up counter - not avilable right now
          </Text>

          <View className="p-3 bg-white border border-[#E8EBF0] rounded-[12px]">
            <QrCodeMockup />
          </View>

          <Text className="text-[20px] font-extrabold text-[#171B20] mt-4 tracking-widest">
            {orderLabel}
          </Text>
        </View>

        <View className="bg-white rounded-2xl border border-[#E8EBF0] overflow-hidden mb-6">
          <View className="p-4 flex-row items-center justify-between border-b border-[#F4F6F9]">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-12 h-12 rounded-[10px] bg-[#065FCC]/10 items-center justify-center mr-3">
                <Ionicons name="restaurant" size={22} color="#065FCC" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-[16px] font-bold text-[#171B20]"
                  numberOfLines={1}
                >
                  {displayBranchName}
                </Text>
                <Text
                  className="text-[13px] font-medium text-[#6E7682] mt-0.5"
                  numberOfLines={1}
                >
                  Order {orderLabel}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={toggleDetails}
            activeOpacity={0.8}
            className="px-4 py-3 flex-row items-center justify-between bg-[#FCFDFE]"
          >
            <Text className="text-[14px] font-bold text-[#424957]">
              Order Details
            </Text>
            <Ionicons
              name={showDetails ? "chevron-up" : "chevron-down"}
              size={18}
              color="#6E7682"
            />
          </TouchableOpacity>

          {showDetails && (
            <View className="px-4 pb-4 pt-1 bg-[#FCFDFE]">
              {isLoading && !trackedOrder ? (
                <View className="py-4 items-center">
                  <ActivityIndicator color="#065FCC" />
                  <Text className="text-[13px] text-[#858C9B] mt-2">
                    Loading order details...
                  </Text>
                </View>
              ) : orderItems.length > 0 ? (
                orderItems.map((line) => (
                  <View key={line.id} className="flex-row justify-between mb-2">
                    <Text className="text-[14px] text-[#5A6270] flex-1">
                      {line.quantity}x {line.branchMenuItem.name}
                    </Text>
                    <Text className="text-[14px] font-semibold text-[#171B20]">
                      {formatPrice(parseFloat(line.totalPrice))}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-[14px] text-[#858C9B] py-2">
                  No items found for this order.
                </Text>
              )}
              <View className="h-px bg-[#E8EBF0] my-2" />
              <View className="flex-row justify-between mb-1">
                <Text className="text-[13px] text-[#858C9B]">
                  Payment Method
                </Text>
                <Text className="text-[13px] font-medium text-[#424957]">
                  {paymentMethod}
                </Text>
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-[14px] font-bold text-[#171B20]">
                  Total Paid
                </Text>
                <Text className="text-[14px] font-extrabold text-[#065FCC]">
                  {formatPrice(orderTotal)}
                </Text>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleReturnHome}
          activeOpacity={0.9}
          className="h-14 rounded-[12px] bg-[#065FCC] items-center justify-center shadow-md shadow-blue-500/25 mt-2"
        >
          <Text className="text-[17px] font-bold text-white">Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function ProgressStep({
  label,
  active,
  completed,
  icon,
  current = false,
}: {
  label: string;
  active: boolean;
  completed: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  current?: boolean;
}) {
  const bgColor = completed
    ? "bg-[#128A4D]"
    : current
      ? "bg-[#065FCC]"
      : active
        ? "bg-[#065FCC]"
        : "bg-[#E8EBF0]";

  const textColor = completed
    ? "text-[#128A4D]"
    : current || active
      ? "text-[#065FCC]"
      : "text-[#BEC8DA]";

  return (
    <View className="items-center">
      <View
        className={`w-8 h-8 rounded-full items-center justify-center ${bgColor}`}
      >
        <Ionicons
          name={completed && icon !== "gift-outline" ? "checkmark" : icon}
          size={16}
          color={active || completed ? "#FFFFFF" : "#BEC8DA"}
        />
      </View>
      <Text className={`text-[11px] font-bold mt-2 ${textColor}`}>{label}</Text>
    </View>
  );
}

function ProgressLine({ active }: { active: boolean }) {
  return (
    <View
      className={`flex-1 h-0.5 mx-2 mb-4 ${
        active ? "bg-[#065FCC]" : "bg-[#E8EBF0]"
      }`}
    />
  );
}

function QrCodeMockup() {
  const grid = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
    [1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
  ];

  return (
    <View
      style={{
        width: 140,
        height: 140,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {grid.map((row, rIdx) => (
        <View key={rIdx} className="flex-row">
          {row.map((cell, cIdx) => (
            <View
              key={cIdx}
              style={{
                width: 7,
                height: 7,
                backgroundColor: cell === 1 ? "#171B20" : "transparent",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
