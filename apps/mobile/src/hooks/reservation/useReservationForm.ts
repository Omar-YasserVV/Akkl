import {
    getNextReservationDates,
    getReservationDiningZones,
    getReservationPartySizes,
    getReservationTimeSlots,
    validateReservationDetails,
} from "@/lib/reservation";
import {
    ChoiceOption,
    ReservationDiningZone,
    ReservationDetails,
    ReservationPartySize,
    ReservationValidationErrors,
} from "@/types/reservation";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface ReservationFormState {
  details: ReservationDetails;
  errors: ReservationValidationErrors;
  isValid: boolean;
  availableDates: ChoiceOption<string>[];
  availableTimes: ChoiceOption<string>[];
  diningZoneOptions: ChoiceOption<ReservationDiningZone>[];
  partySizeOptions: ReservationPartySize[];
}

export function getInitialReservationDetails(
  branchId: string,
  branchName: string,
  restaurantName: string,
): ReservationDetails {
  const defaultDate = getNextReservationDates(1)[0]?.value ?? "";
  const defaultTime = getReservationTimeSlots()[0]?.value ?? "18:00";

  return {
    branchId,
    branchName,
    restaurantName,
    diningZone: "indoor",
    date: defaultDate,
    time: defaultTime,
    partySize: 2,
    specialRequest: "",
  };
}

export function useReservationForm(initialDetails: ReservationDetails) {
  const [details, setDetails] = useState<ReservationDetails>(initialDetails);

  useEffect(() => {
    setDetails(initialDetails);
  }, [initialDetails]);

  const errors = useMemo(
    () => validateReservationDetails(details),
    [details],
  );

  const isValid = useMemo(
    () => Object.keys(errors).length === 0,
    [errors],
  );

  const availableDates = useMemo(() => getNextReservationDates(3), []);
  const availableTimes = useMemo(() => getReservationTimeSlots(), []);
  const diningZoneOptions = useMemo(() => getReservationDiningZones(), []);
  const partySizeOptions = useMemo(() => getReservationPartySizes(), []);

  const updateField = useCallback(
    <K extends keyof ReservationDetails>(
      field: K,
      value: ReservationDetails[K],
    ) => {
      setDetails((current) => ({
        ...current,
        [field]: value,
      }));
    },
    [],
  );

  return {
    details,
    errors,
    isValid,
    availableDates,
    availableTimes,
    diningZoneOptions,
    partySizeOptions,
    updateField,
  } as const;
}
