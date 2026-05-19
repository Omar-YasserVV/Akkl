import { Button, Switch } from "@heroui/react";
import { LuCalendarDays, LuCopy, LuInfo, LuUmbrella, LuZap } from "react-icons/lu";
import SectionCard from "../SectionCard";
import { useSettingsStore } from "../../store/useSettingsStore";
import DayScheduleRow from "./DayScheduleRow";

const OperatingHoursStep = () => {
  const operatingHours = useSettingsStore(
    (state) => state.data.operatingHours,
  );
  const updateDaySchedule = useSettingsStore((state) => state.updateDaySchedule);
  const updateBusyMode = useSettingsStore((state) => state.updateBusyMode);

  const applyMondayToAll = () => {
    const monday = operatingHours.weeklySchedule.find((day) => day.id === "monday");
    if (!monday) return;

    operatingHours.weeklySchedule.forEach((day) => {
      updateDaySchedule(day.id, {
        isOpen: monday.isOpen,
        openTime: monday.openTime,
        closeTime: monday.closeTime,
      });
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <LuCalendarDays className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-bold text-slate-950">
              Weekly Schedule
            </h2>
          </div>
          <Button
            size="sm"
            variant="light"
            color="primary"
            className="font-semibold"
            onPress={applyMondayToAll}
            startContent={<LuCopy size={16} />}
          >
            Apply Monday to all
          </Button>
        </div>

        {operatingHours.weeklySchedule.map((day) => (
          <DayScheduleRow
            key={day.id}
            day={day}
            onChange={(updates) => updateDaySchedule(day.id, updates)}
          />
        ))}
      </article>

      <div className="space-y-5">
        <SectionCard>
          <div className="mb-4 flex items-center gap-2">
            <LuZap className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-950">
              Automated Busy Mode
            </h2>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-slate-500">
            Automatically pause new orders or increase lead times when your
            kitchen reaches capacity to maintain food quality.
          </p>

          <div className="space-y-6">
            <label className="block space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Active Order Threshold
                </span>
                <span className="flex h-8 items-center justify-center rounded bg-primary/10 px-3 text-xs font-bold text-primary">
                  {operatingHours.busyMode.activeOrderThreshold}
                  <span className="ml-1 font-medium">Orders</span>
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={operatingHours.busyMode.activeOrderThreshold}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-primary"
                onChange={(event) =>
                  updateBusyMode({
                    activeOrderThreshold: Number(event.target.value),
                  })
                }
              />
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Relaxed (1)</span>
                <span>Busy (25)</span>
                <span>Extreme (50)</span>
              </div>
            </label>

            <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <LuInfo className="mt-0.5 shrink-0 text-primary" size={16} />
              <p className="text-xs leading-5 text-slate-600">
                When active, customers will see a "High Demand" notice on the
                storefront.
              </p>
            </div>
          </div>
        </SectionCard>

        <article className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <LuUmbrella className="h-5 w-5 text-slate-400" />
            <h2 className="text-base font-bold text-slate-950">
              Holiday Closure
            </h2>
          </div>
          <Switch
            color="primary"
            size="md"
            isSelected={operatingHours.busyMode.holidayClosure}
            onValueChange={(holidayClosure) =>
              updateBusyMode({ holidayClosure })
            }
          />
        </article>

        <div className="rounded-2xl bg-primary p-6 text-white shadow-lg shadow-primary/20">
          <h3 className="text-lg font-bold">Need help?</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-white/90">
            Our onboarding team is ready to assist you with your schedule setup.
          </p>
          <Button className="mt-6 w-full rounded-xl bg-white text-[15px] font-bold text-primary shadow-sm hover:bg-white/90">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OperatingHoursStep;
