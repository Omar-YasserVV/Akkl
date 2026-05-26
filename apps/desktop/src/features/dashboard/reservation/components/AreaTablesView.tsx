import { Button } from "@heroui/react";
import { useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { LuArmchair, LuArrowLeft, LuCalendarDays, LuHourglass, LuPlus } from "react-icons/lu";
import { useSettingsStore } from "../../settings/store/useSettingsStore";
import type { DiningTable } from "../../settings/types/settings.types";
import { useReservationStats } from "../hooks/useReservationStats";
import { useReservationStore } from "../store/useReservationStore";
import NewReservationModal from "./NewReservationModal";
import ReservationSidebar from "./ReservationSidebar";
import TableCard from "./TableCard";
import TableModal from "./TableModal";

type AreaTablesViewProps = {
  areaId: string;
  onBack: () => void;
};

const AreaTablesView = ({ areaId, onBack }: AreaTablesViewProps) => {
  const zones = useSettingsStore((state) => state.data.floorPlan.zones);
  const zone = zones.find((z) => z.id === areaId);
  const { reservations, waitlist } = useReservationStore();
  const stats = useReservationStats(areaId);
  const removeTable = useSettingsStore((state) => state.removeTable);

  const [activeTab, setActiveTab] = useState<string>("All Tables");
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<DiningTable | null>(null);

  if (!zone) return null;

  const filteredTables = zone.tables.filter((table) => {
    if (activeTab === "All Tables") return true;
    return table.status === activeTab;
  });

  return (
    <div className="mx-auto max-w-8xl space-y-6 py-2">
      {/* Header (Full Width) */}
      <div>
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
        >
          <LuArrowLeft size={16} />
          Back to Areas
        </button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-cherry text-primary text-5xl leading-tight">
              {zone.name} Tables
            </h1>
            <p className="text-muted-foreground">
              Configure and manage table layout for your {zone.name.toLowerCase()}.
            </p>
          </div>
          <Button
            color="primary"
            className="w-[320px] h-12 rounded-2xl text-xl text-white shadow-sm flex items-center justify-center gap-2"
            onPress={() => setIsNewReservationOpen(true)}
          >
            <BsPlusCircle size={22} />
            Add New Reservation
          </Button>
        </div>
      </div>

      {/* Two Column Layout Below Header */}
      <div className="flex gap-8">
        {/* Main Content (Left Column) */}
        <div className="flex-1 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Bookings Today
                </p>
                <div className="mt-1 flex flex-col items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {stats.totalBookingsToday}
                  </span>
                  <span className="text-xs font-bold text-[#10B981]">
                    ↗ +12% from yesterday
                  </span>
                </div>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-primary">
                <LuCalendarDays size={24} />
              </div>
            </div>

            <div className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Available Tables
                </p>
                <div className="mt-1 flex flex-col items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {stats.availableTables}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Out of {stats.totalTables} total tables
                  </span>
                </div>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-primary">
                <LuArmchair size={24} />
              </div>
            </div>

            <div className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Waitlist Count
                </p>
                <div className="mt-1 flex flex-col items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {stats.waitlistCount}
                  </span>
                  <span className="text-xs font-bold text-orange-500">
                    ⚠ Avg wait: {stats.averageWaitTime} mins
                  </span>
                </div>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-primary">
                <LuHourglass size={24} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-slate-200">
            {["All Tables", "Available", "Occupied", "Reserved"].map((tab) => (
              <button
                key={tab}
                className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-bold transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tab === "All Tables" && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] ${
                      activeTab === tab
                        ? "bg-primary/10 text-primary"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {zone.tables.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button
              className="grid min-h-[160px] place-items-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-slate-300 hover:bg-slate-100"
              onClick={() => setIsAddTableOpen(true)}
            >
              <div className="text-center">
                <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-400 shadow-sm">
                  <LuPlus size={20} />
                </div>
                <span className="text-sm font-bold text-slate-600">
                  Quick Add Table
                </span>
              </div>
            </button>

            {filteredTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onEdit={() => setEditingTable(table)}
                onDelete={() => removeTable(areaId, table.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar (Right Column) */}
        <div className="w-[320px] shrink-0">
          <ReservationSidebar reservations={reservations} waitlist={waitlist} />
        </div>
      </div>

      {/* Modals */}
      <TableModal
        isOpen={isAddTableOpen}
        mode="add"
        table={null}
        defaultAreaId={areaId}
        onClose={() => setIsAddTableOpen(false)}
      />
      <TableModal
        isOpen={Boolean(editingTable)}
        mode="edit"
        table={editingTable}
        defaultAreaId={areaId}
        onClose={() => setEditingTable(null)}
      />
      <NewReservationModal
        isOpen={isNewReservationOpen}
        onClose={() => setIsNewReservationOpen(false)}
        defaultAreaId={areaId}
      />
    </div>
  );
};

export default AreaTablesView;
