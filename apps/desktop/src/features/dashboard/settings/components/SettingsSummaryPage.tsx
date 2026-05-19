import { Button, Chip } from "@heroui/react";
import {
  LuBuilding2,
  LuCalendarClock,
  LuGrid3X3,
  LuPencil,
  LuPrinter,
} from "react-icons/lu";
import SectionCard from "./SectionCard";
import { settingsSteps } from "../static/settingsDefaults";
import { useSettingsStore } from "../store/useSettingsStore";
import type { SettingsStepId } from "../types/settings.types";

const SettingsSummaryPage = () => {
  const data = useSettingsStore((state) => state.data);
  const setActiveStepId = useSettingsStore((state) => state.setActiveStepId);
  const reopenOnboarding = useSettingsStore((state) => state.reopenOnboarding);

  const editStep = (stepId: SettingsStepId) => {
    reopenOnboarding();
    setActiveStepId(stepId);
  };

  return (
    <div className="mx-auto max-w-[1320px] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Settings
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Branch setup
          </h1>
          <p className="mt-2 max-w-2xl text-slate-500">
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

      <SectionCard
        title="Branch identity"
        description="Customer-facing and operational profile information."
        right={<LuBuilding2 className="h-6 w-6 text-primary" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <SummaryItem label="Branch" value={data.branchIdentity.branchName} />
          <SummaryItem label="Phone" value={data.branchIdentity.phone} />
          <SummaryItem
            label="Address"
            value={data.branchIdentity.address}
            className="md:col-span-2"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Operating hours"
        description="Weekly schedule and branch demand controls."
        right={<LuCalendarClock className="h-6 w-6 text-primary" />}
      >
        <div className="grid gap-3">
          {data.operatingHours.weeklySchedule.map((day) => (
            <div
              key={day.id}
              className="grid gap-3 rounded-xl bg-slate-50 px-4 py-3 md:grid-cols-[170px_1fr]"
            >
              <p className="font-bold text-slate-700">{day.label}</p>
              <p className="text-slate-500">
                {day.isOpen ? `${day.openTime} to ${day.closeTime}` : "Closed"}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Floor plan"
        description="Dining zones and table capacities."
        right={<LuGrid3X3 className="h-6 w-6 text-primary" />}
      >
        <div className="grid gap-4">
          {data.floorPlan.zones.map((zone) => (
            <div key={zone.id} className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold text-slate-950">{zone.name}</h3>
                <Chip variant="flat" color="primary">
                  {zone.type}
                </Chip>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {zone.tables.map((table) => (
                  <div
                    key={table.id}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3"
                  >
                    <p className="font-semibold text-slate-800">{table.name}</p>
                    <p className="text-sm text-slate-500">
                      {table.capacity} guests - {table.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Hardware"
        description="Devices configured for this branch."
        right={<LuPrinter className="h-6 w-6 text-primary" />}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {data.hardware.devices.map((device) => (
            <div key={device.id} className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-slate-950">{device.name}</p>
                <Chip
                  variant="flat"
                  color={device.isEnabled ? "success" : "default"}
                >
                  {device.isEnabled ? device.status : "Disabled"}
                </Chip>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {device.description}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

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

export default SettingsSummaryPage;
