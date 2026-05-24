import { useReservationStore } from "../store/useReservationStore";
import { useSettingsStore } from "../../settings/store/useSettingsStore";

export const useReservationStats = (areaId: string) => {
  const { reservations, waitlist } = useReservationStore();
  const zones = useSettingsStore((state) => state.data.floorPlan.zones);

  const zone = zones.find((z) => z.id === areaId);
  const tables = zone?.tables || [];

  const today = new Date().toISOString().split("T")[0];

  const todayReservations = reservations.filter(
    (res) => res.date === today && res.areaId === areaId,
  );

  const totalBookingsToday = todayReservations.length;

  const waitlistCount = waitlist.filter((w) => w.status === "Waiting").length;

  // Let's assume a table is "Occupied" if there is a "Seated" reservation for it today,
  // "Reserved" if there is a "Confirmed" reservation in the near future (simplified for now),
  // "Available" otherwise. Or just use the status from the table object `table.status`
  // Actually, the settings store has `status: TableStatus` which is "Available" | "Reserved".
  // Let's calculate based on `table.status` for simplicity if we don't have real time tracking yet.
  
  // For realistic UI:
  const availableTables = tables.filter((t) => t.status === "Available").length;
  const totalTables = tables.length;

  const averageWaitTime = waitlist.length > 0 
    ? Math.round(waitlist.reduce((sum, w) => sum + w.quotedWaitTime, 0) / waitlist.length)
    : 0;

  return {
    totalBookingsToday,
    availableTables,
    totalTables,
    waitlistCount,
    averageWaitTime,
  };
};
