export type ReservationStatus =
  | "Confirmed"
  | "Seated"
  | "Completed"
  | "Cancelled"
  | "No Show";

export type WaitlistStatus = "Waiting" | "Notified" | "Seated" | "Left";

export type GuestDetails = {
  fullName: string;
  phoneNumber: string;
  emailAddress?: string;
  specialRequests?: string;
};

export type Reservation = {
  id: string;
  guest: GuestDetails;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  guestsCount: number;
  areaId: string;
  tableId?: string; // Optional, might not be assigned immediately
  status: ReservationStatus;
  createdAt: string; // ISO String
};

export type WaitlistEntry = {
  id: string;
  guest: GuestDetails;
  guestsCount: number;
  quotedWaitTime: number; // in minutes
  status: WaitlistStatus;
  createdAt: string; // ISO String
};
