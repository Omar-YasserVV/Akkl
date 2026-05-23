import { Button, Input } from "@heroui/react";
import { LuInfo, LuPlus, LuSearch } from "react-icons/lu";
import { useSettingsStore } from "../../settings/store/useSettingsStore";
import AreaListRow from "./AreaListRow";

type DefineAreasViewProps = {
  onSelectArea: (areaId: string) => void;
};

const DefineAreasView = ({ onSelectArea }: DefineAreasViewProps) => {
  const zones = useSettingsStore((state) => state.data.floorPlan.zones);

  const totalCapacity = zones.reduce((sum, zone) => {
    return sum + zone.tables.reduce((tSum, table) => tSum + table.capacity, 0);
  }, 0);

  return (
    <div className=" space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cherry text-primary text-5xl leading-tight">
            Define Areas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Organize your restaurant into logical zones for easier management.
          </p>
        </div>
        <Button color="primary" className="font-bold text-white shadow-sm">
          <LuPlus size={18} />
          Add New Area
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            TOTAL ZONES
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {zones.length} Areas
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            TOTAL CAPACITY
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {totalCapacity} Guests
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="text-lg font-bold text-slate-900">Existing Areas</h2>
          <div className="w-64">
            <Input
              variant="faded"
              placeholder="Search areas..."
              startContent={<LuSearch className="text-slate-400" />}
              size="sm"
              classNames={{
                inputWrapper: "bg-slate-50 border-slate-200 shadow-none",
              }}
            />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">AREA NAME</th>
              <th className="px-6 py-4">DESCRIPTION</th>
              <th className="px-6 py-4">CAPACITY</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {zones.map((zone) => (
              <AreaListRow
                key={zone.id}
                zone={zone}
                onSelect={() => onSelectArea(zone.id)}
              />
            ))}
          </tbody>
        </table>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <span className="text-xs font-medium text-slate-500">
            Showing {zones.length} of {zones.length} areas
          </span>
          <div className="flex gap-2">
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-400 opacity-50">
              {"<"}
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600">
              {">"}
            </button>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <LuInfo className="text-primary" size={20} />
          <h3 className="font-bold text-slate-900">Area Management Tips</h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
            Define areas based on physical walls or distinct service zones for easier table assignment.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
            Use descriptive names that servers will recognize instantly.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
            Capacity is calculated by the sum of all tables within the zone.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DefineAreasView;
