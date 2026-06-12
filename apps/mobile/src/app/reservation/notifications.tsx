import { useReservationStore } from "@/stores/reservation-store";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReservationNotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const details = useReservationStore((state) => state.details);
  const setStatus = useReservationStore((state) => state.setStatus);

  const openResult = (status: "confirmed" | "declined") => {
    setStatus(status);
    router.push(`/reservation/result?status=${status}` as Href);
  };

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
        <View className="mb-5 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={22} color="#0057C0" />
          </TouchableOpacity>
          <Text className="ml-5 flex-1 text-[18px] font-extrabold text-[#1C2026]">
            Notifications
          </Text>
          <Ionicons name="settings-outline" size={21} color="#252B33" />
        </View>

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[11px] font-extrabold uppercase text-[#8A93A2]">Recent</Text>
          <TouchableOpacity>
            <Text className="text-[11px] font-extrabold text-[#0057C0]">Mark all as read</Text>
          </TouchableOpacity>
        </View>

        <NotificationCard
          accent="#22C55E"
          icon="checkmark-circle"
          title="Reservation Confirmed!"
          body={`Your table at ${details?.branchName ?? "Downtown Branch"} for 7:30 PM is ready. See you soon!`}
          time="Just now"
          primaryLabel="View Details"
          onPress={() => openResult("confirmed")}
        />

        <NotificationCard
          accent="#3F83D8"
          icon="bag-handle"
          title="Order #AKK-9902 is Ready"
          body="Your Truffle Glazed Burger is ready for pickup at the counter."
          time="2 hours ago"
        />

        <Text className="mb-3 mt-5 text-[11px] font-extrabold uppercase text-[#8A93A2]">Older</Text>
        <NotificationCard
          accent="#B7BDC8"
          icon="pricetag-outline"
          title="Special Offer: 20% Off"
          body="Enjoy a discount on your next visit to any Akkl branch."
          time="Yesterday"
        />

        <View className="mt-4 overflow-hidden rounded-[12px] bg-[#0F172A]">
          <View className="h-28 bg-[#24313F]" />
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute bottom-4 left-4 right-4">
            <Text className="text-[10px] font-extrabold uppercase text-white/70">
              New Experience
            </Text>
            <Text className="mt-1 text-[15px] font-extrabold text-white">
              Join our Weekend Tasting Menu
            </Text>
            <Text className="mt-1 text-[11px] font-semibold text-white/85">
              Reserve your spot for an exclusive 5-course journey.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => openResult("declined")}
          activeOpacity={0.85}
          className="mt-4 h-11 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-white"
        >
          <Text className="text-[12px] font-extrabold text-[#D14343]">
            Preview Declined State
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function NotificationCard({
  accent,
  icon,
  title,
  body,
  time,
  primaryLabel,
  onPress,
}: {
  accent: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  time: string;
  primaryLabel?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.88}
      className="mb-3 flex-row rounded-[10px] border border-[#E8EBF0] bg-white p-3"
    >
      <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}20` }}>
        <Ionicons name={icon} size={19} color={accent} />
      </View>
      <View className="ml-3 flex-1">
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 text-[14px] font-extrabold leading-4 text-[#1C2026]">
            {title}
          </Text>
          <Text className="ml-2 text-[10px] font-bold text-[#0057C0]">{time}</Text>
        </View>
        <Text className="mt-1 text-[12px] font-semibold leading-4 text-[#667085]">{body}</Text>
        {primaryLabel ? (
          <View className="mt-3 h-8 self-start justify-center rounded-[6px] bg-[#0057C0] px-4">
            <Text className="text-[11px] font-extrabold text-white">{primaryLabel}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
