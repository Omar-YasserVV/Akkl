import {
    ChoiceOption,
    ReservationDiningZone,
    ReservationDetails,
    ReservationPartySize,
    ReservationResponse,
} from "@/types/reservation";

const AVAILABLE_TIME_SLOTS: ChoiceOption<string>[] = [
  { label: "12:00 PM", value: "12:00" },
  { label: "12:30 PM", value: "12:30" },
  { label: "01:00 PM", value: "13:00" },
  { label: "01:30 PM", value: "13:30" },
  { label: "02:00 PM", value: "14:00" },
  { label: "06:00 PM", value: "18:00" },
  { label: "07:00 PM", value: "19:00" },
  { label: "08:00 PM", value: "20:00" },
];

const PARTY_SIZE_OPTIONS: ReservationPartySize[] = [1, 2, 3, 4, 5, 6, 7, 8];
const DINING_ZONE_OPTIONS: ChoiceOption<ReservationDiningZone>[] = [
  { label: "Indoor", value: "indoor" },
  { label: "Outdoor", value: "outdoor" },
];

export function getReservationTimeSlots(): ChoiceOption<string>[] {
  return AVAILABLE_TIME_SLOTS;
}

export function getReservationPartySizes(): ReservationPartySize[] {
  return PARTY_SIZE_OPTIONS;
}

export function getReservationDiningZones(): ChoiceOption<ReservationDiningZone>[] {
  return DINING_ZONE_OPTIONS;
}

export function getNextReservationDates(days = 3): ChoiceOption<string>[] {
  const options: ChoiceOption<string>[] = [];
  const now = new Date();

  for (let index = 0; index < days; index += 1) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + index);

    const label = candidate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    options.push({
      label,
      value: candidate.toISOString().split("T")[0],
    });
  }

  return options;
}

export type ReservationValidationErrors = Partial<
  Record<keyof Omit<ReservationDetails, "specialRequest" | "guestName" | "guestPhone">, string>
>;

export function validateReservationDetails(
  details: ReservationDetails,
): ReservationValidationErrors {
  const errors: ReservationValidationErrors = {};

  if (!details.branchId) {
    errors.branchId = "Please select a branch.";
  }

  if (!details.date) {
    errors.date = "Choose a reservation date.";
  }

  if (!details.time) {
    errors.time = "Choose a reservation time.";
  }

  if (!details.partySize || details.partySize < 1) {
    errors.partySize = "Add a party size.";
  }

  if (!details.diningZone) {
    errors.diningZone = "Choose a dining zone.";
  }

  return errors;
}

export async function confirmReservation(
  details: ReservationDetails,
): Promise<ReservationResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reservationId: `R-${Date.now()}`,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        details,
      });
    }, 700);
  });
}
