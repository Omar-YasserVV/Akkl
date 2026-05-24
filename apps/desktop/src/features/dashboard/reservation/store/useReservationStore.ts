import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Reservation, WaitlistEntry } from "../types/reservation.types";
import { defaultReservations, defaultWaitlist } from "../static/reservationDefaults";

type ReservationStore = {
  reservations: Reservation[];
  waitlist: WaitlistEntry[];
  addReservation: (reservation: Reservation) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  removeReservation: (id: string) => void;
  addWaitlistEntry: (entry: WaitlistEntry) => void;
  updateWaitlistEntry: (id: string, updates: Partial<WaitlistEntry>) => void;
  removeWaitlistEntry: (id: string) => void;
};

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set) => ({
      reservations: defaultReservations,
      waitlist: defaultWaitlist,
      addReservation: (reservation) =>
        set((state) => ({
          reservations: [...state.reservations, reservation],
        })),
      updateReservation: (id, updates) =>
        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.id === id ? { ...res, ...updates } : res,
          ),
        })),
      removeReservation: (id) =>
        set((state) => ({
          reservations: state.reservations.filter((res) => res.id !== id),
        })),
      addWaitlistEntry: (entry) =>
        set((state) => ({
          waitlist: [...state.waitlist, entry],
        })),
      updateWaitlistEntry: (id, updates) =>
        set((state) => ({
          waitlist: state.waitlist.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry,
          ),
        })),
      removeWaitlistEntry: (id) =>
        set((state) => ({
          waitlist: state.waitlist.filter((entry) => entry.id !== id),
        })),
    }),
    {
      name: "akkl-reservation-store",
    },
  ),
);
