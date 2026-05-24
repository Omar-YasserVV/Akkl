import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import { LuLayoutGrid, LuPlus } from "react-icons/lu";
import { useSettingsStore } from "../../settings/store/useSettingsStore";
import type { DiningTable, TableStatus } from "../../settings/types/settings.types";
type AddTableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultAreaId?: string;
};

const AddTableModal = ({ isOpen, onClose, defaultAreaId }: AddTableModalProps) => {
  const zones = useSettingsStore((state) => state.data.floorPlan.zones);
  const addTable = useSettingsStore((state) => state.addTable);

  const [tableId, setTableId] = useState("");
  const [selectedArea, setSelectedArea] = useState(defaultAreaId || "");
  const [capacity, setCapacity] = useState<number>(4);
  const [status, setStatus] = useState<string>("Available");

  const handleAdd = () => {
    if (!selectedArea || !tableId) return;
    
    addTable(selectedArea, {
      id: `${selectedArea}-${Date.now()}`,
      name: tableId,
      capacity,
      status: status as TableStatus,
    } as DiningTable);
    
    onClose();
    setTableId("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" classNames={{ base: "bg-white" }}>
      <ModalContent>
        <ModalHeader className="flex items-center gap-2 border-b border-slate-100 pb-4 pt-6">
          <LuLayoutGrid className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-slate-900">Add New Table</h2>
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
                  onChange={(e) => setTableId(e.target.value)}
                  classNames={{ inputWrapper: "bg-slate-50 border-slate-200 shadow-none" }}
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
                  classNames={{ trigger: "bg-slate-50 border-slate-200 shadow-none" }}
                >
                  {zones.map((zone) => (
                    <SelectItem key={zone.id}>
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
                  {[2, 4, 6, 8].map((cap) => (
                    <Button
                      key={cap}
                      size="sm"
                      variant={capacity === cap ? "solid" : "bordered"}
                      color={capacity === cap ? "primary" : "default"}
                      className={capacity !== cap ? "border-slate-200 bg-white" : ""}
                      onPress={() => setCapacity(cap)}
                    >
                      {cap}{cap === 8 ? "+" : "-seater"}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Initial Status
                </label>
                <RadioGroup
                  orientation="horizontal"
                  value={status}
                  onValueChange={setStatus}
                  size="sm"
                >
                  <Radio value="Available">Available</Radio>
                  <Radio value="Reserved">Reserved</Radio>
                </RadioGroup>
              </div>
            </div>

            {/* Preview Side */}
            <div className="grid w-1/2 place-items-center bg-[#F4F7FB] p-6 text-center">
              <div>
                <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-2xl bg-white shadow-xl">
                  <span className="text-2xl font-bold text-primary">
                    {tableId || "T-?"}
                  </span>
                  
                  {/* Chairs (Visuals) */}
                  <div className="absolute -top-3 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full bg-blue-400 opacity-50" />
                  <div className="absolute -bottom-3 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full bg-blue-400 opacity-50" />
                  {capacity >= 4 && (
                    <>
                      <div className="absolute -left-3 top-1/2 h-10 w-2 -translate-y-1/2 rounded-full bg-blue-400 opacity-50" />
                      <div className="absolute -right-3 top-1/2 h-10 w-2 -translate-y-1/2 rounded-full bg-blue-400 opacity-50" />
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
        <ModalFooter className="border-t border-slate-100 px-6 py-4">
          <Button variant="light" className="font-bold text-slate-600" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" className="font-bold text-white shadow-sm" onPress={handleAdd}>
            <LuPlus size={16} /> Add Table
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTableModal;
