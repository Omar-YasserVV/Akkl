import { useReservationStore } from "@/stores/reservation-store";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReservationResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ status?: string }>();
  const details = useReservationStore((state) => state.details);
  const status = params.status === "declined" ? "declined" : "confirmed";
  const confirmed = status === "confirmed";

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-7 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={22} color="#0057C0" />
          </TouchableOpacity>
          <Text className="ml-5 flex-1 text-[18px] font-extrabold text-[#1C2026]">
            Notifications
          </Text>
          <Ionicons name="settings-outline" size={21} color="#252B33" />
        </View>

        <View className="items-center">
          <View
            className="h-[92px] w-[92px] items-center justify-center rounded-full"
            style={{ backgroundColor: confirmed ? "#22C55E" : "#FEE2E2" }}
          >
            <Ionicons
              name={confirmed ? "checkmark" : "calendar-clear"}
              size={42}
              color={confirmed ? "#FFFFFF" : "#DC2626"}
            />
          </View>
          <Text className="mt-6 text-center text-[23px] font-extrabold text-[#1C2026]">
            {confirmed ? "Reservation Confirmed!" : "Reservation Declined"}
          </Text>
          <Text className="mt-3 max-w-[285px] text-center text-[14px] font-semibold leading-5 text-[#5A6372]">
            {confirmed
              ? "We've saved a spot for you. Your table will be ready shortly after your arrival."
              : `We're sorry, but ${details?.branchName ?? "Downtown Branch"} is fully booked for your requested time. The host was unable to accommodate this specific request.`}
          </Text>
        </View>

        <View className="mt-8 rounded-[12px] border border-[#E2E8F0] bg-white p-4">
          {confirmed ? (
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-[11px] font-extrabold uppercase text-[#0057C0]">Branch</Text>
                <Text className="mt-1 text-[15px] font-extrabold text-[#1C2026]">
                  {details?.branchName ?? "Downtown Branch"}
                </Text>
              </View>
              <View className="rounded-full bg-[#E8F0FF] px-3 py-1">
                <Text className="text-[10px] font-extrabold text-[#0057C0]">Table #12</Text>
              </View>
            </View>
          ) : null}

          <View className="flex-row gap-3">
            <MiniDetail label="Date" value={confirmed ? formatShortDate(details?.date) : "Friday, Oct 24, 2023"} icon="calendar-outline" />
            <MiniDetail label="Time" value={formatTime(details?.time)} icon="time-outline" />
          </View>
          <View className="mt-3 flex-row gap-3">
            <MiniDetail label="Party Size" value={`${details?.partySize ?? 4} Guests`} icon="people-outline" />
            {confirmed ? <MiniDetail label="Voucher" value="Ready" icon="qr-code-outline" /> : null}
          </View>

          {confirmed ? (
            <View className="mt-4 border-l-4 border-[#0057C0] py-3 pl-3">
              <Text className="text-[12px] font-semibold text-[#8A93A2]">
                Show this voucher at the reception
              </Text>
            </View>
          ) : null}
        </View>

        {confirmed ? (
          <TouchableOpacity
            activeOpacity={0.88}
            className="mt-5 h-14 flex-row items-center justify-center rounded-[9px] border border-[#D9DEE7] bg-white"
          >
            <Ionicons name="receipt-outline" size={18} color="#1C2026" />
            <Text className="ml-2 text-[15px] font-extrabold text-[#1C2026]">
              View My Orders
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <View className="mt-5 flex-row rounded-[10px] bg-[#EAF3FF] p-3">
              <View className="h-10 w-10 items-center justify-center rounded-[8px] bg-[#0057C0]">
                <Ionicons name="bag-handle" size={19} color="#FFFFFF" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-[14px] font-extrabold text-[#0057C0]">Still hungry?</Text>
                <Text className="mt-1 text-[12px] font-semibold leading-4 text-[#3F6EA8]">
                  You can still enjoy our full menu via Pick-Up. Most orders are ready in 20 minutes.
                </Text>
                <TouchableOpacity onPress={() => router.push("/pickup/menu" as Href)}>
                  <Text className="mt-2 text-[12px] font-extrabold uppercase text-[#0057C0]">
                    Order for pick-up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.replace("/reservation" as Href)}
              activeOpacity={0.88}
              className="mt-5 h-14 items-center justify-center rounded-[9px] border border-[#D9DEE7] bg-white"
            >
              <Text className="text-[15px] font-extrabold text-[#4B5563]">
                Try Another Branch
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          activeOpacity={0.88}
          className="mt-8 self-center rounded-full bg-white px-4 py-2"
        >
          <Text className="text-[12px] font-extrabold text-[#0057C0]">Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function MiniDetail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View className="min-h-[74px] flex-1 rounded-[8px] border border-[#E8EBF0] bg-white p-3">
      <View className="flex-row items-center">
        <Ionicons name={icon} size={14} color="#3F83D8" />
        <Text className="ml-1 text-[10px] font-extrabold uppercase text-[#8A93A2]">{label}</Text>
      </View>
      <Text className="mt-2 text-[13px] font-extrabold text-[#1C2026]">{value}</Text>
    </View>
  );
}

function formatShortDate(value?: string) {
  if (!value) return "Oct 24, 2023";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value?: string) {
  if (!value) return "7:30 PM";
  const [hour = "0", minute = "00"] = value.split(":");
  const date = new Date();
  date.setHours(Number(hour), Number(minute), 0, 0);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
