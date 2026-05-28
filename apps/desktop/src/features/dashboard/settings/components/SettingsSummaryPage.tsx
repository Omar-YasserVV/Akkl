import { Button, Chip } from "@heroui/react";
import {
  LuBuilding2,
  LuCalendarClock,
  LuGrid3X3,
  LuPencil,
  LuPrinter,
  LuWarehouse,
} from "react-icons/lu";
import { settingsSteps } from "../static/settingsDefaults";
import { useSettingsStore } from "../store/useSettingsStore";
import type { SettingsStepId } from "../types/settings.types";
import SectionCard from "./SectionCard";

const SettingsSummaryPage = () => {
  const setActiveStepId = useSettingsStore((state) => state.setActiveStepId);
  const reopenOnboarding = useSettingsStore((state) => state.reopenOnboarding);
  const branchDetails = useSettingsStore((state) => state.branchDetails);
  const settingsData = useSettingsStore((state) => state.data);

  const editStep = (stepId: SettingsStepId) => {
    reopenOnboarding();
    setActiveStepId(stepId);
  };

  if (!branchDetails) return null;

  return (
    <div className="mx-auto max-w-[1320px] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-cherry text-primary text-5xl leading-tight">
            Branch setup
          </h1>
          <p className="text-muted-foreground">
            Review and adjust the onboarding information in one vertically
            scrollable settings page.
          </p>
        </div>
        <Button
          color="primary"
          className="rounded-xl font-bold text-white"
          onPress={() => editStep(settingsSteps[0]!.id)}
        >
          <LuPencil className="h-5 w-5" />
          Edit Setup
        </Button>
      </header>

      {/* Branch Identity */}
      <SectionCard
        title="Branch identity"
        description="Customer-facing and operational profile information."
        right={<LuBuilding2 className="h-6 w-6 text-primary" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <SummaryItem label="Branch" value={branchDetails.name} />
          <SummaryItem
            label="Branch number"
            value={branchDetails.branchNumber}
          />
          <SummaryItem label="Phone" value={branchDetails.phone ?? "Not set"} />
          <SummaryItem label="Status" value={branchDetails.status} />
          <SummaryItem
            label="Address"
            value={branchDetails.address ?? "Not set"}
            className="md:col-span-2"
          />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <FeatureFlag label="Tables" enabled={branchDetails.haveTables} />
          <FeatureFlag
            label="Reservations"
            enabled={branchDetails.haveReservations}
          />
          <FeatureFlag
            label="Warehouses"
            enabled={branchDetails.haveWarehouses}
          />
        </div>
      </SectionCard>

      {/* Operating Hours */}
      <SectionCard
        title="Operating hours"
        description="Weekly schedule and branch demand controls."
        right={<LuCalendarClock className="h-6 w-6 text-primary" />}
      >
        <div className="grid gap-3">
          {settingsData.operatingHours.weeklySchedule.map((day) => {
            return (
              <div
                key={day.id}
                className="grid gap-3 rounded-xl bg-slate-50 px-4 py-3 md:grid-cols-[170px_1fr]"
              >
                <p className="font-bold text-slate-700">{day.label}</p>
                <p className={day.isOpen ? "text-slate-500" : "text-red-400"}>
                  {day.isOpen
                    ? `${day.openTime} to ${day.closeTime}`
                    : "Closed"}
                </p>
              </div>
            );
          })}
        </div>

        {/* Busy Mode */}
        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Busy mode settings
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <SummaryItem
              label="Order threshold"
              value={String(branchDetails.busyModeSettings.orderThreshold)}
            />
            <SummaryItem
              label="Extra prep time"
              value={`${branchDetails.busyModeSettings.extraPrepTimeMinutes} min`}
            />
            <FeatureFlag
              label="Auto-busy"
              enabled={branchDetails.busyModeSettings.autoBusyEnabled}
            />
          </div>
        </div>
      </SectionCard>

      {/* Floor Plan */}
      <SectionCard
        title="Floor plan"
        description="Dining zones and table capacities."
        right={<LuGrid3X3 className="h-6 w-6 text-primary" />}
      >
        {branchDetails.tables.length === 0 ? (
          <p className="text-slate-500">No tables configured.</p>
        ) : (
          <div className="grid gap-4">
            {groupTablesByZone(branchDetails.tables).map(
              ({ zoneName, tables }) => (
                <div key={zoneName} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-slate-950">{zoneName}</h3>
                    <Chip variant="flat" color="primary">
                      {tables.length} {tables.length === 1 ? "table" : "tables"}
                    </Chip>
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-3">
                    {tables.map((table) => (
                      <div
                        key={table.id}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-3"
                      >
                        <p className="font-semibold text-slate-800">
                          {table.tableNumber}
                        </p>
                        <p className="text-sm text-slate-500">
                          {table.capacity} guests
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </SectionCard>

      {/* Warehouse */}
      <SectionCard
        title="Warehouse"
        description="Storage units configured for this branch."
        right={<LuWarehouse className="h-6 w-6 text-primary" />}
      >
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="font-bold text-slate-950">
            {branchDetails.warehouses?.name ?? "No warehouse configured"}
          </p>
          {branchDetails.warehouses && (
            <p className="mt-1 text-sm text-slate-500">
              ID: {branchDetails.warehouses.id}
            </p>
          )}
        </div>
      </SectionCard>

      {/* Hardware */}
      <SectionCard
        title="Hardware"
        description="Devices configured for this branch."
        right={<LuPrinter className="h-6 w-6 text-primary" />}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {branchDetails.hardware.map((device) => (
            <div key={device.id} className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-slate-950">{device.name}</p>
                <Chip variant="flat" color="primary">
                  {device.type}
                </Chip>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                IP: {device.ipAddress}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

// Groups flat tables array into zones
function groupTablesByZone(
  tables: {
    id: string;
    tableNumber: string;
    capacity: number;
    zoneName: string;
    branchId: string;
  }[],
) {
  const map = new Map<string, typeof tables>();
  for (const table of tables) {
    if (!map.has(table.zoneName)) map.set(table.zoneName, []);
    map.get(table.zoneName)!.push(table);
  }
  return Array.from(map.entries()).map(([zoneName, tables]) => ({
    zoneName,
    tables,
  }));
}

type SummaryItemProps = {
  label: string;
  value: string;
  className?: string;
};

const SummaryItem = ({ label, value, className = "" }: SummaryItemProps) => (
  <div className={`rounded-xl bg-slate-50 p-4 ${className}`}>
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
      {label}
    </p>
    <p className="mt-2 font-semibold text-slate-800">{value}</p>
  </div>
);

const FeatureFlag = ({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) => (
  <div className="rounded-xl bg-slate-50 p-4">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
      {label}
    </p>
    <Chip
      className="mt-2"
      variant="flat"
      color={enabled ? "success" : "default"}
    >
      {enabled ? "Enabled" : "Disabled"}
    </Chip>
  </div>
);

export default SettingsSummaryPage;
