import type { ReservationDetails, ReservationResponse, ReservationStatus } from "@/types/reservation";
import { create } from "zustand";

export interface ReservationRequestState {
  details: ReservationDetails | null;
  response: ReservationResponse | null;
  setDetails: (details: ReservationDetails) => void;
  submitRequest: () => ReservationResponse | null;
  setStatus: (status: ReservationStatus) => void;
  clearReservation: () => void;
}

function createReservationId() {
  return `RSV-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const useReservationStore = create<ReservationRequestState>((set, get) => ({
  details: null,
  response: null,

  setDetails: (details) => {
    set({ details, response: null });
  },

  submitRequest: () => {
    const details = get().details;
    if (!details) return null;

    const response: ReservationResponse = {
      reservationId: createReservationId(),
      status: "pending",
      createdAt: new Date().toISOString(),
      details,
    };

    set({ response });
    return response;
  },

  setStatus: (status) => {
    const response = get().response;
    if (!response) return;

    set({ response: { ...response, status } });
  },

  clearReservation: () => {
    set({ details: null, response: null });
  },
}));
