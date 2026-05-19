import { Button } from "@heroui/react";
import {
  LuMonitor,
  LuPrinter,
  LuRefreshCw,
  LuSearch,
  LuWifi,
  LuInfo,
} from "react-icons/lu";

const HardwareConnectingStep = () => {
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

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <LuMonitor className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">
              Kitchen Display Systems (KDS)
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            2 Devices Found
          </span>
        </div>

        <div className="space-y-3">
          <article className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <LuMonitor className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Kitchen Line 01</h3>
                <p className="text-xs text-slate-400">
                  IP: 192.168.1.45 • v2.4.1
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-[#10B981]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                CONNECTED
              </span>
              <Button variant="bordered" className="bg-white font-semibold">
                Test
              </Button>
            </div>
          </article>

          <article className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <LuMonitor className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Prep Station B</h3>
                <p className="text-xs text-slate-400">IP: 192.168.1.48</p>
              </div>
            </div>
            <Button color="primary" className="font-semibold text-white">
              Connect
            </Button>
          </article>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <LuPrinter className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">
              Receipt Printers
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            1 Device Found
          </span>
        </div>

        <div className="space-y-3">
          <article className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-white shadow-sm">
                <LuPrinter className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Main Bar Thermal</h3>
                <p className="text-xs text-slate-400">
                  Epson TM-T88VI • IP: 192.168.1.102
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-[#10B981]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                ONLINE
              </span>
              <Button
                color="primary"
                variant="flat"
                className="bg-primary/10 font-bold text-primary"
              >
                Test Print
              </Button>
            </div>
          </article>
        </div>
      </div>

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

export default HardwareConnectingStep;
