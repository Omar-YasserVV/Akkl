import { Input } from "@heroui/react";
import { LuInfo, LuMapPin, LuPhone, LuSearch, LuStore } from "react-icons/lu";
import { MdOutlineGpsFixed } from "react-icons/md";
import { useSettingsStore } from "../../store/useSettingsStore";

const BranchIdentityStep = () => {
  const branchIdentity = useSettingsStore((state) => state.data.branchIdentity);
  const updateBranchIdentity = useSettingsStore(
    (state) => state.updateBranchIdentity,
  );

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Restaurant Branch Name
          </p>
          <Input
            placeholder="e.g. Downtown Bistro"
            variant="faded"
            radius="md"
            size="lg"
            classNames={{
              inputWrapper: "bg-slate-50 border-slate-200",
            }}
            startContent={<LuStore className="text-slate-400" size={18} />}
            value={branchIdentity.branchName}
            onValueChange={(branchName) => updateBranchIdentity({ branchName })}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Contact Phone Numbers
          </p>
          <Input
            placeholder="+1 (555) 000-0000"
            variant="faded"
            radius="md"
            size="lg"
            classNames={{
              inputWrapper: "bg-slate-50 border-slate-200",
            }}
            startContent={<LuPhone className="text-slate-400" size={18} />}
            value={branchIdentity.phone}
            onValueChange={(phone) => updateBranchIdentity({ phone })}
          />
          <p className="mt-2 text-xs text-slate-400">
            Separate multiple numbers with commas.
          </p>
        </div>

        <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
          <LuInfo className="mt-0.5 shrink-0 text-primary" size={20} />
          <p className="text-sm leading-relaxed text-slate-700">
            <strong>Why this matters?</strong> Precise GPS data ensures that
            delivery partners and customers find your exact entrance without
            delays.
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">
          Specific Location
        </p>
        <div className="relative h-75 w-full overflow-hidden rounded-xl border border-slate-200 bg-[#E8EAE6] shadow-inner">
          {/* Mock Map Background */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#D1E4D1]/40" />

          <div className="absolute left-4 right-4 top-4 flex gap-2">
            <Input
              placeholder="Search address or pin location"
              variant="flat"
              radius="md"
              value={branchIdentity.address}
              onValueChange={(address) => updateBranchIdentity({ address })}
              classNames={{
                inputWrapper: "bg-white shadow-sm",
              }}
              startContent={<LuSearch className="text-slate-400" size={18} />}
            />
            <button className="flex aspect-square h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm hover:bg-primary/90">
              <MdOutlineGpsFixed size={20} />
            </button>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-md">
                  <LuMapPin size={14} className="fill-current" />
                </div>
              </div>
              <div className="mt-1 h-2 w-2 rounded-full bg-primary shadow-sm" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
            <MdOutlineGpsFixed size={14} />
            40.7128° N, 74.0060° W
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchIdentityStep;
