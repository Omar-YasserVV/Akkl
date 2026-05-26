import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { LuLayoutGrid, LuX } from "react-icons/lu";
import { useSettingsStore } from "../../settings/store/useSettingsStore";
import type { DiningTable, TableStatus } from "../../settings/types/settings.types";

type TableModalProps = {
  isOpen: boolean;
  mode: "add" | "edit";
  table: DiningTable | null;
  defaultAreaId?: string;
  onClose: () => void;
};

const capacityOptions = [2, 4, 6, 8];

const TableModal = ({
  isOpen,
  mode,
  table,
  defaultAreaId,
  onClose,
}: TableModalProps) => {
  const zones = useSettingsStore((state) => state.data.floorPlan.zones);
  const addTable = useSettingsStore((state) => state.addTable);
  const updateTable = useSettingsStore((state) => state.updateTable);
  const removeTable = useSettingsStore((state) => state.removeTable);

  const [tableId, setTableId] = useState("");
  const [selectedArea, setSelectedArea] = useState(defaultAreaId || "");
  const [capacity, setCapacity] = useState(4);
  const [status, setStatus] = useState<TableStatus>("Available");

  // Synchronize state when the modal opens or props change
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && table) {
        setTableId(table.name);
        const parentZone = zones.find((z) =>
          z.tables.some((t) => t.id === table.id)
        );
        setSelectedArea(parentZone?.id || defaultAreaId || "");
        setCapacity(table.capacity);
        setStatus(table.status);
      } else {
        setTableId("");
        setSelectedArea(defaultAreaId || "");
        setCapacity(4);
        setStatus("Available");
      }
    }
  }, [isOpen, mode, table, defaultAreaId, zones]);

  const handleSubmit = () => {
    const nameToSave = tableId.trim() || `Table ${Date.now().toString().slice(-3)}`;
    
    if (mode === "add") {
      if (!selectedArea) return;
      addTable(selectedArea, {
        id: `${nameToSave.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        name: nameToSave,
        capacity,
        status,
      });
    } else if (mode === "edit" && table) {
      if (!selectedArea) return;
      const originalZone = zones.find((z) =>
        z.tables.some((t) => t.id === table.id)
      );
      const originalZoneId = originalZone?.id;

      if (originalZoneId && originalZoneId !== selectedArea) {
        // Table was moved to a different area: remove from old zone, add to new zone
        removeTable(originalZoneId, table.id);
        addTable(selectedArea, {
          id: table.id,
          name: nameToSave,
          capacity,
          status,
        });
      } else {
        // Just update table fields within the same zone
        updateTable(selectedArea, table.id, {
          name: nameToSave,
          capacity,
          status,
        });
      }
    }
    
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
      classNames={{ base: "bg-white rounded-3xl overflow-hidden", closeButton: "hidden" }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between border-b border-slate-100 pb-4 pt-6 px-6">
          <div className="flex items-center gap-2">
            <LuLayoutGrid className="text-primary h-6 w-6" />
            <h2 className="text-xl font-bold text-slate-900">
              {mode === "add" ? "Add New Table" : "Edit Table"}
            </h2>
          </div>
          <Button isIconOnly variant="light" size="sm" onPress={onClose} aria-label="Close">
            <LuX className="h-5 w-5 text-slate-400" />
          </Button>
        </ModalHeader>

        <ModalBody className="p-0">
          <div className="flex">
            {/* Form Side */}
            <div className="w-1/2 p-6 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Table ID
                </label>
                <Input
                  placeholder="e.g., T6, T7"
                  variant="faded"
                  value={tableId}
                  onValueChange={setTableId}
                  classNames={{ inputWrapper: "bg-slate-50 border-slate-200 shadow-none h-11" }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Select Area
                </label>
                <Select
                  placeholder="Choose an area"
                  variant="faded"
                  selectedKeys={selectedArea ? [selectedArea] : []}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  classNames={{ trigger: "bg-slate-50 border-slate-200 shadow-none h-11" }}
                >
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} textValue={zone.name}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Capacity
                </label>
                <div className="flex gap-2">
                  {capacityOptions.map((option) => (
                    <Button
                      key={option}
                      size="sm"
                      variant={capacity === option ? "solid" : "bordered"}
                      color={capacity === option ? "primary" : "default"}
                      className={capacity !== option ? "border-slate-200 bg-white text-slate-600 font-bold" : "font-bold"}
                      onPress={() => setCapacity(option)}
                    >
                      {option === 8 ? "8+" : `${option}-seater`}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Initial Status
                </label>
                <div className="flex gap-2">
                  {(["Available", "Reserved"] as TableStatus[]).map((item) => (
                    <Button
                      key={item}
                      size="sm"
                      variant={status === item ? "solid" : "bordered"}
                      color={status === item ? "primary" : "default"}
                      className={status !== item ? "border-slate-200 bg-white text-slate-600 font-bold" : "font-bold"}
                      onPress={() => setStatus(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Side */}
            <div className="grid w-1/2 place-items-center bg-[#F4F7FB] p-6 text-center">
              <div>
                <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-2xl bg-white shadow-xl">
                  <span className="text-2xl font-bold text-primary">
                    {tableId.trim() || "T-?"}
                  </span>
                  
                  {/* Chairs (Visuals matching the design layout) */}
                  <div className="absolute -top-3 left-1/2 h-2.5 w-10 -translate-x-1/2 rounded-full bg-blue-400 opacity-50" />
                  <div className="absolute -bottom-3 left-1/2 h-2.5 w-10 -translate-x-1/2 rounded-full bg-blue-400 opacity-50" />
                  {capacity >= 4 && (
                    <>
                      <div className="absolute -left-3 top-1/2 h-10 w-2.5 -translate-y-1/2 rounded-full bg-blue-400 opacity-50" />
                      <div className="absolute -right-3 top-1/2 h-10 w-2.5 -translate-y-1/2 rounded-full bg-blue-400 opacity-50" />
                    </>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                  This preview updates automatically as you change table specifications.
                </p>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-slate-100 px-6 py-4 flex justify-end items-center gap-4">
          <Button variant="light" className="font-bold text-slate-600" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" className="font-bold text-white shadow-sm px-5" onPress={handleSubmit}>
            {mode === "add" ? "+ Add Table" : "Save Changes"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TableModal;
