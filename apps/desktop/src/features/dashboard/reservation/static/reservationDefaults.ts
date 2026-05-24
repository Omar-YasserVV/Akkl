import type { Reservation, WaitlistEntry } from "../types/reservation.types";

const today = new Date().toISOString().split("T")[0] as string; // YYYY-MM-DD

export const defaultReservations: Reservation[] = [
  {
    id: "res-1",
    guest: {
      fullName: "James Wilson",
      phoneNumber: "+1 555-0101",
      specialRequests: "Anniversary celebration, window seat if possible.",
    },
    date: today,
    time: "18:30",
    guestsCount: 4,
    areaId: "indoor-main-hall",
    tableId: "indoor-12",
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-2",
    guest: {
      fullName: "Sarah Jenkins",
      phoneNumber: "+1 555-0102",
    },
    date: today,
    time: "19:00",
    guestsCount: 2,
    areaId: "indoor-main-hall",
    tableId: "indoor-4",
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-3",
    guest: {
      fullName: "Michael Chen",
      phoneNumber: "+1 555-0103",
    },
    date: today,
    time: "19:15",
    guestsCount: 6,
    areaId: "outdoor-terrace",
    tableId: "outdoor-1",
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  },
];

export const defaultWaitlist: WaitlistEntry[] = [
  {
    id: "wait-1",
    guest: {
      fullName: "Robinson Party",
      phoneNumber: "+1 555-0201",
    },
    guestsCount: 4,
    quotedWaitTime: 15,
    status: "Waiting",
    createdAt: new Date().toISOString(),
  },
];
