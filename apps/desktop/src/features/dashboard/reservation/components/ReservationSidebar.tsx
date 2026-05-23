import { Button } from "@heroui/react";
import { LuBellRing, LuUsers } from "react-icons/lu";
import type { Reservation, WaitlistEntry } from "../types/reservation.types";

type ReservationSidebarProps = {
  reservations: Reservation[];
  waitlist: WaitlistEntry[];
};

const ReservationSidebar = ({ reservations, waitlist }: ReservationSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Upcoming Reservations */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Upcoming</h3>
          <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            TODAY
          </span>
        </div>

        <div className="space-y-3">
          {reservations.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming reservations.</p>
          ) : (
            reservations.map((res) => (
              <div
                key={res.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-slate-200 hover:bg-slate-100/50"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="font-bold text-slate-900">
                    {res.guest.fullName}
                  </h4>
                  <span className="text-sm font-bold text-primary">
                    {res.time}
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <LuUsers size={14} />
                    {res.guestsCount} Guests
                  </span>
                  <span>•</span>
                  <span>{res.tableId ? (res.tableId.split('-')[1] || "").toUpperCase() : "Unassigned"}</span>
                </div>
                {res.guest.specialRequests && (
                  <p className="mt-2 text-xs italic text-slate-400">
                    {res.guest.specialRequests}
                  </p>
                )}
              </div>
            ))
          )}

          <Button
            variant="light"
            className="w-full font-bold text-primary"
          >
            View All Reservations
          </Button>
        </div>
      </div>

      {/* Waitlist */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Waitlist ({waitlist.length})
        </h3>

        <div className="space-y-3">
          {waitlist.length === 0 ? (
            <p className="text-sm text-slate-500">Waitlist is empty.</p>
          ) : (
             waitlist.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div>
                  <h4 className="font-bold text-slate-900">
                    {entry.guest.fullName}
                  </h4>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {entry.guestsCount} pax • {entry.quotedWaitTime} min wait
                  </p>
                </div>
                <Button
                  isIconOnly
                  variant="flat"
                  color="primary"
                  className="bg-primary/10 text-primary"
                >
                  <LuBellRing size={16} />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationSidebar;
