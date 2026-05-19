import { Button, Input, Modal, ModalBody, ModalContent } from "@heroui/react";
import { useState } from "react";
import { LuGrid3X3, LuX } from "react-icons/lu";
import type { DiningTable, TableStatus } from "../../types/settings.types";

type AddTableModalProps = {
  isOpen: boolean;
  zoneName: string;
  onClose: () => void;
  onAdd: (table: DiningTable) => void;
};

const capacityOptions = [2, 4, 6, 8];

const AddTableModal = ({
  isOpen,
  zoneName,
  onClose,
  onAdd,
}: AddTableModalProps) => {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [status, setStatus] = useState<TableStatus>("Available");

  const handleAdd = () => {
    const tableName = name.trim() || `Table ${Date.now().toString().slice(-3)}`;
    onAdd({
      id: `${tableName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: tableName,
      capacity,
      status,
    });
    setName("");
    setCapacity(4);
    setStatus("Available");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      size="4xl"
      onClose={onClose}
      classNames={{ base: "rounded-3xl", closeButton: "hidden" }}
    >
      <ModalContent>
        <ModalBody className="p-0">
          <header className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
            <div className="flex items-center gap-4">
              <LuGrid3X3 className="h-7 w-7 text-primary" />
              <h2 className="text-3xl font-bold text-slate-950">
                Add New Table
              </h2>
            </div>
            <Button isIconOnly variant="light" onPress={onClose}>
              <LuX className="h-7 w-7 text-slate-400" />
            </Button>
          </header>

          <div className="grid md:grid-cols-[1.1fr_0.75fr]">
            <div className="space-y-7 p-8">
              <Input
                label="Table ID"
                placeholder="e.g., T6, T7"
                variant="bordered"
                value={name}
                onValueChange={setName}
              />
              <Input
                label="Area"
                variant="bordered"
                value={zoneName}
                isReadOnly
              />

              <div className="space-y-3">
                <p className="font-bold text-slate-700">Capacity</p>
                <div className="grid grid-cols-4 gap-3">
                  {capacityOptions.map((option) => (
                    <Button
                      key={option}
                      color={capacity === option ? "primary" : "default"}
                      variant={capacity === option ? "solid" : "bordered"}
                      className="rounded-xl font-bold"
                      onPress={() => setCapacity(option)}
                    >
                      {option === 8 ? "8+" : `${option}-seater`}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-bold text-slate-700">Initial Status</p>
                <div className="flex gap-3">
                  {(["Available", "Reserved"] as TableStatus[]).map((item) => (
                    <Button
                      key={item}
                      variant={status === item ? "solid" : "bordered"}
                      color={status === item ? "primary" : "default"}
                      className="rounded-xl font-semibold"
                      onPress={() => setStatus(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <aside className="flex flex-col items-center justify-center bg-primary/10 p-8 text-center">
              <div className="relative flex h-52 w-52 items-center justify-center rounded-2xl border-8 border-primary/15 bg-white shadow-xl">
                <span className="text-4xl font-bold text-primary">
                  {name.trim() || "T-?"}
                </span>
                <span className="absolute -top-5 h-7 w-20 rounded-full bg-primary/40" />
                <span className="absolute -bottom-5 h-7 w-20 rounded-full bg-primary/40" />
                <span className="absolute -left-5 h-20 w-7 rounded-full bg-primary/40" />
                <span className="absolute -right-5 h-20 w-7 rounded-full bg-primary/40" />
              </div>
              <p className="mt-12 max-w-xs text-lg leading-7 text-slate-500">
                This preview updates automatically as you change table
                specifications.
              </p>
            </aside>
          </div>

          <footer className="flex justify-end gap-4 border-t border-slate-200 px-8 py-6">
            <Button variant="light" className="font-semibold" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              className="rounded-xl font-bold text-white"
              onPress={handleAdd}
            >
              Add Table
            </Button>
          </footer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddTableModal;
