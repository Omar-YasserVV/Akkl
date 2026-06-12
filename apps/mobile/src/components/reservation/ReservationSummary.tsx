import { ReservationDetails } from "@/types/reservation";
import React from "react";
import { Text, View } from "react-native";

interface ReservationSummaryProps {
  reservation: ReservationDetails;
}

export function ReservationSummary({ reservation }: ReservationSummaryProps) {
  return (
    <View className="rounded-[18px] border border-[#E2E8F0] bg-white p-5 shadow-sm shadow-[#1018280D]">
      <Text className="mb-3 text-[16px] font-semibold text-[#111827]">
        Reservation Details
      </Text>
      <View className="space-y-3">
        <Row label="Branch" value={reservation.branchName} />
        <Row label="Date" value={reservation.date} />
        <Row label="Time" value={reservation.time} />
        <Row label="Guests" value={`${reservation.partySize}`} />
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-[14px] text-[#4B5563]">{label}</Text>
      <Text className="text-[14px] font-semibold text-[#111827]">{value}</Text>
    </View>
  );
}
