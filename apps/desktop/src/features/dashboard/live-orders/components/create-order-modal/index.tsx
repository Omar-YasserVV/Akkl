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
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import { BiPlus, BiTrash, BiX } from "react-icons/bi";

type DraftItem = {
  id: string;
  itemId: string;
  quantity: number;
  notes: string;
};

const CreateOrderModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [draft, setDraft] = useState({
    orderNumber: "",
    customerName: "",
    status: "pending",
    items: [
      {
        id: crypto.randomUUID(),
        itemId: "",
        quantity: 1,
        notes: "",
      },
    ] as DraftItem[],
  });

  const closeModal = () => {
    onClose();
  };

  const updateField = (field: string, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (id: string, field: keyof DraftItem, value: any) => {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addItem = () => {
    setDraft((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          itemId: "",
          quantity: 1,
          notes: "",
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleCreateOrder = () => {
    if (!draft.orderNumber || !draft.customerName) {
      alert("Please fill in required fields");
      return;
    }

    console.log("Prototype Order:", draft);
    closeModal();
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={(isOpen) => !isOpen && closeModal()}
      size="lg"
      hideCloseButton
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex justify-between">
          <h3 className="text-xl font-bold">Create New Order</h3>
          <button onClick={closeModal}>
            <BiX size={24} />
          </button>
        </ModalHeader>

        <ModalBody className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Order Number *"
              value={draft.orderNumber}
              onValueChange={(val) => updateField("orderNumber", val)}
              labelPlacement="outside"
            />
            <Input
              label="Customer Name *"
              value={draft.customerName}
              onValueChange={(val) => updateField("customerName", val)}
              labelPlacement="outside"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Source"
              value="Restaurant"
              isDisabled
              labelPlacement="outside"
            />
            <Select
              label="Status"
              selectedKeys={[draft.status]}
              onSelectionChange={(keys) =>
                updateField("status", Array.from(keys)[0])
              }
              labelPlacement="outside"
            >
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="cooking">Cooking</SelectItem>
              <SelectItem key="ready">Ready</SelectItem>
            </Select>
          </div>

          {draft.items.map((item, index) => (
            <div key={item.id} className="border p-4 rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Item #{index + 1}</span>
                {draft.items.length > 1 && (
                  <button onClick={() => removeItem(item.id)}>
                    <BiTrash size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-[1fr_80px] gap-3">
                <Select
                  placeholder="Select Item"
                  selectedKeys={item.itemId ? [item.itemId] : []}
                  onSelectionChange={(keys) =>
                    updateItem(item.id, "itemId", Array.from(keys)[0] as string)
                  }
                >
                  <SelectItem key="pizza">Pizza</SelectItem>
                  <SelectItem key="burger">Burger</SelectItem>
                  <SelectItem key="pasta">Pasta</SelectItem>
                </Select>

                <Input
                  type="number"
                  value={item.quantity.toString()}
                  onValueChange={(val) =>
                    updateItem(item.id, "quantity", parseInt(val) || 0)
                  }
                />
              </div>

              <Textarea
                placeholder="Special notes..."
                value={item.notes}
                onValueChange={(val) => updateItem(item.id, "notes", val)}
              />
            </div>
          ))}

          <Button onPress={addItem}>
            <BiPlus size={18} /> Add another item
          </Button>
        </ModalBody>

        <ModalFooter>
          <Button variant="bordered" onPress={closeModal}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleCreateOrder}>
            Create Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateOrderModal;
