import { Button } from "@heroui/react";
import {
  LuCircleCheck,
  LuInfo,
  LuMonitor,
  LuPrinter,
  LuRefreshCw,
  LuSearch,
  LuSettings,
  LuWifi,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import { useSettingsStore } from "../../store/useSettingsStore";
import type { HardwareDevice } from "../../types/settings.types";

const HardwareConnectingStep = () => {
  const devices = useSettingsStore((state) => state.data.hardware.devices);
  const updateHardwareDevice = useSettingsStore(
    (state) => state.updateHardwareDevice,
  );
  const kdsDevices = devices.filter(
    (device) => !device.name.toLowerCase().includes("printer"),
  );
  const printerDevices = devices.filter((device) =>
    device.name.toLowerCase().includes("printer"),
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <LuWifi className="h-5 w-5 text-primary" />
          <p className="text-sm font-semibold text-slate-700">
            Network: HQ_Restaurant_Guest
          </p>
        </div>
        <Button
          color="primary"
          className="font-bold text-white shadow-sm"
          startContent={<LuRefreshCw size={16} />}
        >
          Scan for Devices
        </Button>
      </div>

      <DeviceGroup
        title="Kitchen Display Systems (KDS)"
        icon={LuMonitor}
        devices={kdsDevices}
        onToggle={(deviceId, isEnabled) =>
          updateHardwareDevice(deviceId, { isEnabled })
        }
      />

      <DeviceGroup
        title="Receipt Printers"
        icon={LuPrinter}
        devices={printerDevices}
        onToggle={(deviceId, isEnabled) =>
          updateHardwareDevice(deviceId, { isEnabled })
        }
      />

      <div className="grid place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10">
        <LuSearch className="mb-2 h-6 w-6 text-slate-300" />
        <p className="mb-1 text-sm font-semibold text-slate-500">
          Looking for more devices...
        </p>
        <button className="text-xs font-bold text-primary hover:underline">
          Device not found?
        </button>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
        <LuInfo className="mt-0.5 shrink-0 text-primary" size={20} />
        <div>
          <p className="mb-1 text-sm font-bold text-slate-800">
            Pro Tip: IP Reservation
          </p>
          <p className="text-xs leading-5 text-slate-500">
            For the most stable connection, we recommend assigning static IP
            addresses to your printers and KDS units through your router
            settings.
          </p>
        </div>
      </div>
    </div>
  );
};

type DeviceGroupProps = {
  title: string;
  icon: IconType;
  devices: HardwareDevice[];
  onToggle: (deviceId: string, isEnabled: boolean) => void;
};

const DeviceGroup = ({
  title,
  icon: Icon,
  devices,
  onToggle,
}: DeviceGroupProps) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-slate-500" />
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <span className="text-xs font-semibold text-slate-400">
        {devices.length} {devices.length === 1 ? "Device" : "Devices"} Found
      </span>
    </div>

    <div className="space-y-3">
      {devices.map((device) => {
        const StatusIcon = device.isEnabled ? LuCircleCheck : LuSettings;

        return (
          <article
            key={device.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{device.name}</h3>
                <p className="text-xs text-slate-400">{device.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  device.isEnabled ? "text-[#10B981]" : "text-slate-400"
                }`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {device.isEnabled ? device.status.toUpperCase() : "DISABLED"}
              </span>
              <Button
                color={device.isEnabled ? "default" : "primary"}
                variant={device.isEnabled ? "bordered" : "solid"}
                className="font-semibold"
                onPress={() => onToggle(device.id, !device.isEnabled)}
              >
                {device.isEnabled ? "Disable" : "Connect"}
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  </div>
);

export default HardwareConnectingStep;
