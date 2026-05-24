import { Button } from "@heroui/react";
import { FiEdit2, FiHome } from "react-icons/fi";
import { LuGem, LuSun, LuTrash2, LuWine } from "react-icons/lu";
import type { DiningZone } from "../../settings/types/settings.types";
type AreaListRowProps = {
  zone: DiningZone;
  onSelect: () => void;
};

const getIconForZone = (zoneId: string, type: string) => {
  if (zoneId.includes("vip")) return <LuGem className="h-5 w-5 text-purple-500" />;
  if (zoneId.includes("bar")) return <LuWine className="h-5 w-5 text-slate-500" />;
  if (type === "Outdoor") return <LuSun className="h-5 w-5 text-orange-500" />;
  return <FiHome className="h-5 w-5 text-blue-500" />;
};

const getIconBg = (zoneId: string, type: string) => {
  if (zoneId.includes("vip")) return "bg-purple-100";
  if (zoneId.includes("bar")) return "bg-slate-100";
  if (type === "Outdoor") return "bg-orange-100";
  return "bg-blue-100";
};

const AreaListRow = ({ zone, onSelect }: AreaListRowProps) => {
  const tableCount = zone.tables.length;
  const isCustomDisabled = zone.isActive === false;

  return (
    <tr
      className="group cursor-pointer transition-colors hover:bg-slate-50"
      onClick={onSelect}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`grid h-10 w-10 place-items-center rounded-lg ${getIconBg(
              zone.id,
              zone.type,
            )}`}
          >
            {getIconForZone(zone.id, zone.type)}
          </div>
          <span className="font-bold text-slate-900">{zone.name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="max-w-[250px] text-xs leading-5 text-slate-500">
          {zone.description || "No description provided."}
        </p>
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
        {tableCount} {zone.id.includes("bar") ? "Stools" : "Tables"}
      </td>
      <td className="px-6 py-4">
        {isCustomDisabled ? (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            DISABLED
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-[#10B981]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#10B981]">
            ACTIVE
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-slate-400 hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              // handle edit
            }}
          >
            <FiEdit2 size={16} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-slate-400 hover:text-danger"
            onClick={(e) => {
              e.stopPropagation();
              // handle delete
            }}
          >
            <LuTrash2 size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default AreaListRow;
