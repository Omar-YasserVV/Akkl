import { useReservationStore } from "@/stores/reservation-store";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReservationStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const details = useReservationStore((state) => state.details);
  const response = useReservationStore((state) => state.response);

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
            <Ionicons name="arrow-back" size={22} color="#6B7280" />
          </TouchableOpacity>
          <Text className="ml-4 text-[18px] font-extrabold text-[#1C2026]">
            {details?.branchName ?? "Downtown Branch"}
          </Text>
        </View>

        <View className="items-center">
          <View className="h-[92px] w-[92px] items-center justify-center rounded-full bg-[#0057C0]">
            <Ionicons name="checkmark-circle" size={42} color="#FFFFFF" />
          </View>
          <Text className="mt-6 text-center text-[24px] font-extrabold text-[#1C2026]">
            Request Sent!
          </Text>
          <Text className="mt-3 max-w-[270px] text-center text-[14px] font-semibold leading-5 text-[#5A6372]">
            {`Your reservation request for ${details?.branchName ?? "Downtown Branch"} has been sent to our host for review. We'll notify you as soon as it's confirmed.`}
          </Text>
        </View>

        <View className="mt-8 rounded-[12px] border border-[#E2E8F0] bg-white p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-[11px] font-extrabold uppercase text-[#8A93A2]">
              Reservation Details
            </Text>
            <View className="rounded-full bg-[#E8ECF6] px-3 py-1">
              <Text className="text-[10px] font-extrabold text-[#8490A3]">
                {response?.status ?? "pending"}
              </Text>
            </View>
          </View>
          <DetailRow icon="calendar-outline" label="Date" value={formatDate(details?.date)} />
          <DetailRow icon="time-outline" label="Time" value={formatTime(details?.time)} />
          <DetailRow icon="people-outline" label="Guests" value={`${details?.partySize ?? 4} People`} />
        </View>

        <View className="mt-4 flex-row rounded-[10px] bg-[#EAF3FF] p-3">
          <Ionicons name="information-circle-outline" size={18} color="#3F83D8" />
          <Text className="ml-2 flex-1 text-[12px] font-semibold leading-5 text-[#3F6EA8]">
            Hosts typically respond within 15 minutes during peak hours.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/reservation/notifications" as Href)}
          activeOpacity={0.88}
          className="mt-6 h-14 items-center justify-center rounded-[9px] bg-[#0057C0]"
        >
          <Text className="text-[15px] font-extrabold text-white">View Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          activeOpacity={0.88}
          className="mt-3 h-14 items-center justify-center rounded-[9px] border border-[#D9DEE7] bg-white"
        >
          <Text className="text-[15px] font-extrabold text-[#4B5563]">Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="mb-3 flex-row items-center">
      <View className="h-9 w-9 items-center justify-center rounded-[8px] bg-[#EFF6FF]">
        <Ionicons name={icon} size={17} color="#3F83D8" />
      </View>
      <View className="ml-3">
        <Text className="text-[11px] font-semibold text-[#818A98]">{label}</Text>
        <Text className="text-[14px] font-extrabold text-[#1C2026]">{value}</Text>
      </View>
    </View>
  );
}

function formatDate(value?: string) {
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
