import { Button } from "@heroui/react";
import { useState } from "react";
import { GoHome, GoSun } from "react-icons/go";
import { LuGrid3X3, LuPlus } from "react-icons/lu";
import { MdDeck } from "react-icons/md";
import { useSettingsStore } from "../../store/useSettingsStore";
import type {
  DiningTable,
  DiningZone,
  DiningZoneType,
} from "../../types/settings.types";
import OptionPillGroup from "../OptionPillGroup";
import AddTableModal from "./AddTableModal";
import ZoneCard from "./ZoneCard";

const zoneTypeOptions: DiningZoneType[] = ["Indoor", "Outdoor", "Terrace"];

const zoneTypeIcons: Record<DiningZoneType, typeof LuGrid3X3> = {
  Indoor: GoHome,
  Outdoor: GoSun,
  Terrace: MdDeck,
};

const FloorPlanStep = () => {
  const floorPlan = useSettingsStore((state) => state.data.floorPlan);
  const setSelectedZoneType = useSettingsStore(
    (state) => state.setSelectedZoneType,
  );
  const addZone = useSettingsStore((state) => state.addZone);
  const removeZone = useSettingsStore((state) => state.removeZone);
  const addTable = useSettingsStore((state) => state.addTable);
  const updateTable = useSettingsStore((state) => state.updateTable);
  const removeTable = useSettingsStore((state) => state.removeTable);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);

  const visibleZones = floorPlan.zones.filter(
    (zone) => zone.type === floorPlan.selectedZoneType,
  );
  const activeZone = floorPlan.zones.find((zone) => zone.id === activeZoneId);

  const handleAddZone = () => {
    const zoneNumber =
      floorPlan.zones.filter((zone) => zone.type === floorPlan.selectedZoneType)
        .length + 1;
    const zone: DiningZone = {
      id: `${floorPlan.selectedZoneType.toLowerCase()}-${Date.now()}`,
      name: `${floorPlan.selectedZoneType} Zone ${zoneNumber}`,
      type: floorPlan.selectedZoneType,
      tables: [],
    };

    addZone(zone);
  };

  const handleAddTable = (table: DiningTable) => {
    if (activeZoneId) {
      addTable(activeZoneId, table);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <OptionPillGroup
            options={zoneTypeOptions}
            selectedValues={[floorPlan.selectedZoneType]}
            onToggle={setSelectedZoneType}
            optionIcons={zoneTypeIcons}
          />
        </div>
        <Button
          color="primary"
          className=" font-bold text-white"
          onPress={handleAddZone}
        >
          <LuPlus className="h-5 w-5" />
          Add New Zone
        </Button>
      </div>

      {visibleZones.length === 0 ? (
        <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
          <div>
            {(() => {
              const EmptyIcon = zoneTypeIcons[floorPlan.selectedZoneType];
              return <EmptyIcon className="mx-auto h-10 w-10 text-primary" />;
            })()}
            <h2 className="mt-4 text-xl font-bold text-slate-950">
              No {floorPlan.selectedZoneType.toLowerCase()} zones yet
            </h2>
            <p className="mt-2 text-slate-500">
              Add a zone to start building this part of the floor plan.
            </p>
          </div>
        </div>
      ) : (
        visibleZones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            icon={zoneTypeIcons[zone.type as DiningZoneType] || LuGrid3X3}
            onAddTable={() => setActiveZoneId(zone.id)}
            onRemoveZone={() => removeZone(zone.id)}
            onRemoveTable={(tableId) => removeTable(zone.id, tableId)}
            onUpdateTable={(tableId, updates) =>
              updateTable(zone.id, tableId, updates)
            }
          />
        ))
      )}

      <AddTableModal
        isOpen={Boolean(activeZone)}
        zoneName={activeZone?.name ?? ""}
        onClose={() => setActiveZoneId(null)}
        onAdd={handleAddTable}
      />
    </div>
  );
};

export default FloorPlanStep;
