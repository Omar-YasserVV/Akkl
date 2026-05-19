import { Button, Input } from "@heroui/react";
import { LuCopy, LuPlus, LuTrash2, LuX } from "react-icons/lu";
import type { DiningTable, DiningZone } from "../../types/settings.types";

import { ElementType } from "react";

type ZoneCardProps = {
  zone: DiningZone;
  icon: ElementType;
  onAddTable: () => void;
  onRemoveZone: () => void;
  onRemoveTable: (tableId: string) => void;
  onUpdateTable: (tableId: string, updates: Partial<DiningTable>) => void;
};

const ZoneCard = ({
  zone,
  icon: Icon,
  onAddTable,
  onRemoveZone,
  onRemoveTable,
  onUpdateTable,
}: ZoneCardProps) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-slate-950">{zone.name}</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button isIconOnly variant="light" size="sm" aria-label="Duplicate Zone">
            <LuCopy className="h-4 w-4 text-slate-400" />
          </Button>
          <Button isIconOnly variant="light" size="sm" onPress={onRemoveZone} aria-label="Delete Zone">
            <LuTrash2 className="h-4 w-4 text-slate-400" />
          </Button>
        </div>
      </header>

      <div className="space-y-3 p-6">
        <div className="grid gap-4 px-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 md:grid-cols-[1fr_0.8fr_100px]">
          <span>Table Name / Number</span>
          <span>Capacity (Pax)</span>
          <span>Actions</span>
        </div>

        {zone.tables.map((table) => (
          <div
            key={table.id}
            className="grid items-center gap-4 rounded-xl bg-slate-50 px-4 py-2 md:grid-cols-[1fr_0.8fr_100px]"
          >
            <Input
              aria-label="Table name"
              variant="faded"
              radius="md"
              classNames={{
                inputWrapper: "bg-white border-slate-200",
              }}
              value={table.name}
              onValueChange={(name) => onUpdateTable(table.id, { name })}
            />
            <Input
              type="number"
              aria-label="Table capacity"
              min={1}
              variant="faded"
              radius="md"
              classNames={{
                inputWrapper: "bg-white border-slate-200",
              }}
              value={String(table.capacity)}
              onValueChange={(value) =>
                onUpdateTable(table.id, { capacity: Number(value) || 1 })
              }
            />
            <Button
              isIconOnly
              variant="light"
              aria-label={`Remove ${table.name}`}
              onPress={() => onRemoveTable(table.id)}
            >
              <LuX className="h-5 w-5 text-slate-400" />
            </Button>
          </div>
        ))}

        <Button
          variant="bordered"
          className="h-12 w-full rounded-xl border-dashed font-semibold text-slate-500"
          onPress={onAddTable}
        >
          <LuPlus className="h-5 w-5" />
          Add Table to {zone.name}
        </Button>
      </div>
    </article>
  );
};

export default ZoneCard;
