import { Input, Switch } from "@heroui/react";
import type { WeekDaySchedule } from "../../types/settings.types";

type DayScheduleRowProps = {
  day: WeekDaySchedule;
  onChange: (updates: Partial<WeekDaySchedule>) => void;
};

const DayScheduleRow = ({ day, onChange }: DayScheduleRowProps) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 last:border-b-0">
      <div className="flex items-center gap-4">
        <Switch
          color="primary"
          size="md"
          isSelected={day.isOpen}
          onValueChange={(isOpen) => onChange({ isOpen })}
        />
        <p className="w-24 font-bold text-slate-950">{day.label}</p>
      </div>

      <div className="flex-1 max-w-[400px]">
        {day.isOpen ? (
          <div className="flex items-center gap-4">
            <Input
              type="time"
              aria-label={`${day.label} opening time`}
              variant="faded"
              radius="md"
              classNames={{
                inputWrapper: "bg-white border-slate-200",
              }}
              value={day.openTime}
              onValueChange={(openTime) => onChange({ openTime })}
            />
            <span className="text-sm font-semibold text-slate-400">to</span>
            <Input
              type="time"
              aria-label={`${day.label} closing time`}
              variant="faded"
              radius="md"
              classNames={{
                inputWrapper: "bg-white border-slate-200",
              }}
              value={day.closeTime}
              onValueChange={(closeTime) => onChange({ closeTime })}
            />
          </div>
        ) : (
          <div className="flex h-10 items-center justify-center rounded-lg bg-slate-50 text-xs font-bold tracking-widest text-slate-400 uppercase">
            Closed
          </div>
        )}
      </div>
    </div>
  );
};

export default DayScheduleRow;
