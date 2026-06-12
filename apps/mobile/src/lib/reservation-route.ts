import { ReservationDetails, ReservationPartySize, ReservationRouteParams } from "@/types/reservation";

export function buildReservationRouteParams(
  details: ReservationDetails,
): ReservationRouteParams {
  return {
    branchId: details.branchId,
    branchName: details.branchName,
    restaurantName: details.restaurantName,
    diningZone: details.diningZone,
    date: details.date,
    time: details.time,
    partySize: String(details.partySize),
    guestName: details.guestName,
    guestPhone: details.guestPhone,
    specialRequest: details.specialRequest,
  };
}

function parsePartySize(value: string | undefined): ReservationPartySize {
  const parsed = Number(value ?? "2") as ReservationPartySize;
  return ([1, 2, 3, 4, 5, 6, 7, 8] as ReservationPartySize[]).includes(parsed)
    ? parsed
    : 2;
}

export function parseReservationRouteParams(
  params: ReservationRouteParams,
): ReservationDetails {
  return {
    branchId: params.branchId ?? "",
    branchName: params.branchName ?? "",
    restaurantName: params.restaurantName ?? "",
    diningZone: params.diningZone === "outdoor" ? "outdoor" : "indoor",
    date: params.date ?? "",
    time: params.time ?? "",
    partySize: parsePartySize(params.partySize),
    guestName: params.guestName ?? "",
    guestPhone: params.guestPhone ?? "",
    specialRequest: params.specialRequest ?? "",
  };
}
