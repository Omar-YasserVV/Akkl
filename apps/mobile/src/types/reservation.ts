export type ReservationStatus = "pending" | "confirmed" | "declined";

export type ReservationPartySize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ReservationDetails {
  branchId: string;
  branchName: string;
  restaurantName: string;
  diningZone: ReservationDiningZone;
  date: string;
  time: string;
  partySize: ReservationPartySize;
  guestName?: string;
  guestPhone?: string;
  specialRequest: string;
}

export type ReservationRequest = ReservationDetails;

export interface ReservationResponse {
  reservationId: string;
  status: ReservationStatus;
  createdAt: string;
  details: ReservationDetails;
}

export interface ReservationRouteParams {
  branchId?: string;
  branchName?: string;
  restaurantName?: string;
  diningZone?: string;
  date?: string;
  time?: string;
  partySize?: string;
  guestName?: string;
  guestPhone?: string;
  specialRequest?: string;
}

export type ReservationValidationErrors = Partial<
  Record<keyof Omit<ReservationDetails, "specialRequest" | "guestName" | "guestPhone">, string>
>;

export interface ChoiceOption<T extends string | number> {
  label: string;
  value: T;
}

export type ReservationDiningZone = "indoor" | "outdoor";
