import { ReservationField } from "@/components/reservation/ReservationField";
import { ReservationSelect } from "@/components/reservation/ReservationSelect";
import { ReservationSummary } from "@/components/reservation/ReservationSummary";
import { getInitialReservationDetails, useReservationForm } from "@/hooks/reservation/useReservationForm";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReservationDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as Record<string, string | undefined>;
  const insets = useSafeAreaInsets();

  const details = useMemo(() => {
    return getInitialReservationDetails(
      params.branchId ?? "",
      params.branchName ?? "",
      params.restaurantName ?? "",
    );
  }, [params.branchId, params.branchName, params.restaurantName]);

  const {
    details: reservationDetails,
    errors,
    isValid,
    availableDates,
    availableTimes,
    diningZoneOptions,
    partySizeOptions,
    updateField,
  } = useReservationForm(details);

  if (!params.branchId) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-[16px] text-[#4B5563]">Missing branch information.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F7F8FA]" style={{ paddingTop: insets.top }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 30 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-3 text-[20px] font-bold text-[#111827]">
          Reservation Details
        </Text>
        <Text className="mb-6 text-[14px] text-[#4B5563]">
          Fill in your reservation information and confirm your booking.
        </Text>

        <ReservationSummary reservation={reservationDetails} />

        <View className="mt-6">
          <ReservationSelect
            label="Dining Zone"
            options={diningZoneOptions}
            selectedValue={reservationDetails.diningZone}
            onSelect={(value) => updateField("diningZone", value)}
            error={errors.diningZone}
          />
          <ReservationSelect
            label="Date"
            options={availableDates}
            selectedValue={reservationDetails.date}
            onSelect={(value) => updateField("date", value)}
            error={errors.date}
          />
          <ReservationSelect
            label="Time"
            options={availableTimes}
            selectedValue={reservationDetails.time}
            onSelect={(value) => updateField("time", value)}
            error={errors.time}
          />
          <ReservationSelect
            label="Party Size"
            options={partySizeOptions.map((size) => ({
              label: `${size} people`,
              value: size,
            }))}
            selectedValue={reservationDetails.partySize}
            onSelect={(value) => updateField("partySize", value)}
            error={errors.partySize}
          />

          <ReservationField
            label="Guest Name"
            value={reservationDetails.guestName ?? ""}
            placeholder="Enter your name"
            onChangeText={(value) => updateField("guestName", value)}
          />
          <ReservationField
            label="Phone Number"
            value={reservationDetails.guestPhone ?? ""}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            onChangeText={(value) => updateField("guestPhone", value)}
          />
          <ReservationField
            label="Special Request"
            value={reservationDetails.specialRequest}
            placeholder="Add any special requests"
            multiline
            onChangeText={(value) => updateField("specialRequest", value)}
          />

          <TouchableOpacity
            activeOpacity={0.86}
            className={`mt-6 rounded-2xl px-5 py-4 ${
              isValid ? "bg-[#0057C0]" : "bg-[#CBD5E1]"
            }`}
            disabled={!isValid}
            onPress={() =>
              router.push(`/reservation/confirmation?branchId=${encodeURIComponent(reservationDetails.branchId)}&branchName=${encodeURIComponent(reservationDetails.branchName)}&restaurantName=${encodeURIComponent(reservationDetails.restaurantName)}&diningZone=${encodeURIComponent(reservationDetails.diningZone)}&date=${encodeURIComponent(reservationDetails.date)}&time=${encodeURIComponent(reservationDetails.time)}&partySize=${encodeURIComponent(String(reservationDetails.partySize))}&guestName=${encodeURIComponent(reservationDetails.guestName ?? "")}&guestPhone=${encodeURIComponent(reservationDetails.guestPhone ?? "")}&specialRequest=${encodeURIComponent(reservationDetails.specialRequest)}` as Href)
            }
          >
            <Text className="text-center text-[16px] font-semibold text-white">
              Continue to Confirmation
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
