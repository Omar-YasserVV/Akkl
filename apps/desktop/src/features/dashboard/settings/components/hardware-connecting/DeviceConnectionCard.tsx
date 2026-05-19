import { Button, Switch } from "@heroui/react";
import { LuCable, LuCircleCheck, LuSettings } from "react-icons/lu";
import type { HardwareDevice } from "../../types/settings.types";

type DeviceConnectionCardProps = {
  device: HardwareDevice;
  onToggle: (isEnabled: boolean) => void;
};

const statusStyles: Record<HardwareDevice["status"], string> = {
  Connected: "bg-emerald-50 text-emerald-600",
  Optional: "bg-slate-100 text-slate-500",
  "Needs setup": "bg-amber-50 text-amber-600",
};

const DeviceConnectionCard = ({
  device,
  onToggle,
}: DeviceConnectionCardProps) => {
  const StatusIcon = device.status === "Connected" ? LuCircleCheck : LuSettings;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <LuCable className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-950">{device.name}</h2>
            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              {device.description}
            </p>
          </div>
        </div>
        <Switch
          color="primary"
          isSelected={device.isEnabled}
          onValueChange={onToggle}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[device.status]}`}
        >
          <StatusIcon className="h-4 w-4" />
          {device.status}
        </span>
        <Button
          size="sm"
          variant="bordered"
          className="rounded-xl font-semibold"
          isDisabled={!device.isEnabled}
        >
          Configure
        </Button>
      </div>
    </article>
  );
};

export default DeviceConnectionCard;
