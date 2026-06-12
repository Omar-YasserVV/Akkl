import { useSession } from "@/context/session-context";
import { getInitialReservationDetails, useReservationForm } from "@/hooks/reservation/useReservationForm";
import { useReservationStore } from "@/stores/reservation-store";
import type { ReservationDetails } from "@/types/reservation";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const heroImage =
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80";

const fallbackReservation = {
  branchId: "downtown-branch",
  branchName: "Downtown Branch",
  restaurantName: "Akkl",
};

export default function ReservationEntryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { branch, restaurant } = useSession();
  const setReservationDetails = useReservationStore((state) => state.setDetails);

  const initialDetails = useMemo(
    () =>
      getInitialReservationDetails(
        branch?.id ?? fallbackReservation.branchId,
        branch?.name ?? fallbackReservation.branchName,
        restaurant?.name ?? fallbackReservation.restaurantName,
      ),
    [branch?.id, branch?.name, restaurant?.name],
  );

  const {
    details,
    errors,
    isValid,
    availableDates,
    availableTimes,
    diningZoneOptions,
    updateField,
  } = useReservationForm(initialDetails);

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
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={22} color="#0057C0" />
          </TouchableOpacity>
          <Text className="ml-2 text-[16px] font-extrabold text-[#0057C0]">
            Book a Table
          </Text>
          <View className="flex-1" />
          <Ionicons name="person-circle-outline" size={24} color="#596170" />
        </View>

        <View className="overflow-hidden rounded-[12px] bg-[#101828]">
          <Image source={{ uri: heroImage }} style={{ height: 152, width: "100%" }} contentFit="cover" />
          <View className="absolute inset-0 bg-black/35" />
          <View className="absolute bottom-4 left-4 right-4">
            <Text className="text-[10px] font-extrabold uppercase text-white/80">
              Reservation
            </Text>
            <Text className="mt-1 text-[21px] font-extrabold text-white">
              {details.branchName}
            </Text>
          </View>
        </View>

        <FieldLabel label="Select Branch" />
        <View className="h-14 flex-row items-center rounded-xl border border-[#D7DCE5] bg-white px-4">
          <Text className="flex-1 text-[14px] font-semibold text-[#2B313B]">
            {details.branchName}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        </View>

        <FieldLabel label="Dining Zone" />
        <View className="h-12 flex-row rounded-xl bg-[#ECEFF3] p-1">
          {diningZoneOptions.map((option) => {
            const selected = details.diningZone === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => updateField("diningZone", option.value)}
                activeOpacity={0.85}
                className={`flex-1 items-center justify-center rounded-[7px] ${
                  selected ? "bg-white" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-[12px] font-extrabold uppercase ${
                    selected ? "text-[#0057C0]" : "text-[#707887]"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.diningZone ? <ErrorText text={errors.diningZone} /> : null}

        <FieldLabel label="Visit Date" />
        <OptionRow
          icon="calendar-outline"
          options={availableDates}
          selectedValue={details.date}
          onSelect={(value) => updateField("date", value)}
        />
        {errors.date ? <ErrorText text={errors.date} /> : null}

        <FieldLabel label="Preferred Time" />
        <OptionRow
          icon="time-outline"
          options={availableTimes.slice(4)}
          selectedValue={details.time}
          onSelect={(value) => updateField("time", value)}
        />
        {errors.time ? <ErrorText text={errors.time} /> : null}

        <FieldLabel label="Party Size" />
        <View className="h-14 flex-row items-center rounded-xl border border-[#D7DCE5] bg-white px-3">
          <TouchableOpacity
            onPress={() => updateField("partySize", Math.max(1, details.partySize - 1) as ReservationDetails["partySize"])}
            className="h-10 w-10 items-center justify-center rounded-[7px] bg-[#EEF1F5]"
          >
            <Ionicons name="remove" size={18} color="#8B93A1" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-[21px] font-extrabold text-[#0057C0]">
              {details.partySize}
            </Text>
            <Text className="text-[9px] font-extrabold uppercase text-[#6B7280]">
              Guests
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => updateField("partySize", Math.min(8, details.partySize + 1) as ReservationDetails["partySize"])}
            className="h-10 w-10 items-center justify-center rounded-[7px] bg-[#0057C0]"
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View className="mt-4 flex-row gap-2">
          <Hint label="High Chair Available" icon="information-circle-outline" />
          <Hint label="90 min limit" icon="time-outline" />
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          className={`mt-7 h-14 items-center justify-center rounded-[9px] ${
            isValid ? "bg-[#0057C0]" : "bg-[#CBD5E1]"
          }`}
          disabled={!isValid}
          onPress={() => {
            setReservationDetails(details);
            router.push("/dine-in/menu" as Href);
          }}
        >
          <Text className="text-[15px] font-extrabold text-white">
            Proceed to Dine-In Menu
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function FieldLabel({ label }: { label: string }) {
  return (
    <Text className="mb-2 mt-5 text-[10px] font-extrabold uppercase text-[#7A8290]">
      {label}
    </Text>
  );
}

function ErrorText({ text }: { text: string }) {
  return <Text className="mt-1 text-[12px] font-semibold text-[#D14343]">{text}</Text>;
}

function OptionRow<T extends string>({
  icon,
  options,
  selectedValue,
  onSelect,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  options: { label: string; value: T }[];
  selectedValue: T;
  onSelect: (value: T) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {options.map((option) => {
        const selected = option.value === selectedValue;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.86}
            className={`h-12 min-w-33 flex-row items-center rounded-xl border px-3 ${
              selected ? "border-[#0057C0] bg-white" : "border-[#D7DCE5] bg-white"
            }`}
          >
            <Ionicons name={icon} size={17} color={selected ? "#0057C0" : "#697386"} />
            <Text className="ml-2 text-[13px] font-semibold text-[#2B313B]">
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function Hint({
  label,
  icon,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View className="flex-row items-center rounded-full bg-[#ECEFF3] px-3 py-2">
      <Ionicons name={icon} size={14} color="#7B8495" />
      <Text className="ml-1 text-[11px] font-semibold text-[#4E5664]">{label}</Text>
    </View>
  );
}
