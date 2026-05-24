import { Button } from "@heroui/react";
import { LuUsers } from "react-icons/lu";
import type { DiningTable } from "../../settings/types/settings.types";

type TableCardProps = {
  table: DiningTable;
  onEdit: () => void;
  onDelete: () => void;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "text-[#10B981] bg-[#10B981]/10";
    case "Reserved":
      return "text-orange-500 bg-orange-500/10";
    case "Occupied":
    case "Seated":
      return "text-blue-500 bg-blue-500/10";
    default:
      return "text-slate-500 bg-slate-100";
  }
};

const getStatusDotColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-[#10B981]";
    case "Reserved":
      return "bg-orange-500";
    case "Occupied":
    case "Seated":
      return "bg-blue-500";
    default:
      return "bg-slate-500";
  }
};

const TableCard = ({ table, onEdit, onDelete }: TableCardProps) => {
  // In a real app we might derive "Seated" or "Reserved" from the reservations store, 
  // but we fallback to table.status
  const status = table.status;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50">
          <span className="font-bold text-blue-600">{table.name}</span>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(
            status,
          )}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(status)}`}
          />
          {status}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
        <LuUsers size={16} />
        {table.capacity}-seater
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="flex-1 bg-slate-100 font-bold text-slate-600"
          onPress={onEdit}
        >
          Edit
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-slate-100 font-bold text-slate-600"
          onPress={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TableCard;
