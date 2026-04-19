import { useAuthStore } from "@/store/AuthStore";
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
import { OrderState } from "@repo/types";
import { useState } from "react";
import { BiPlus, BiTrash, BiX } from "react-icons/bi";
import { useCreateOrder } from "../../hooks/useLiveOrders";

type DraftItem = {
  id: string;
  menuItemId: string;
  quantity: number;
  specialNotes: string;
};

const CreateOrderModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const user = useAuthStore((state) => state.user);
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();

  const [draft, setDraft] = useState({
    CustomerName: "",
    status: OrderState.PENDING,
    specialNotes: "",
    items: [
      {
        id: crypto.randomUUID(),
        menuItemId: "",
        quantity: 1,
        specialNotes: "",
      },
    ] as DraftItem[],
  });

  const closeModal = () => {
    onClose();
    // Reset state after closing
    setDraft({
      CustomerName: "",
      status: OrderState.PENDING,
      specialNotes: "",
      items: [
        {
          id: crypto.randomUUID(),
          menuItemId: "",
          quantity: 1,
          specialNotes: "",
        },
      ],
    });
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
          menuItemId: "",
          quantity: 1,
          specialNotes: "",
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
    if (!draft.CustomerName || draft.items.some((i) => !i.menuItemId)) {
      alert("Please fill in all required fields and select items.");
      return;
    }

    if (!user?.id) {
      alert("You must be logged in to create an order.");
      return;
    }

    createOrder(
      {
        CustomerName: draft.CustomerName,
        status: draft.status,
        specialNotes: draft.specialNotes,
        userId: user.id.toString(),
        items: draft.items.map(({ menuItemId, quantity }) => ({
          menuItemId,
          quantity,
        })),
      },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={(isOpen) => !isOpen && closeModal()}
      size="xl"
      hideCloseButton
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        header: "border-b border-gray-100 py-4 px-6",
        body: "py-6 px-6",
        footer: "border-t border-gray-100 py-4 px-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Create New Order</h3>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <BiX size={24} />
          </button>
        </ModalHeader>

        <ModalBody className="space-y-8">
          {/* Order Info Section */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Input
              label="Customer Name *"
              placeholder="John Doe"
              value={draft.CustomerName}
              onValueChange={(val) => updateField("CustomerName", val)}
              labelPlacement="outside"
              classNames={{
                label: "font-semibold text-gray-700 mb-1",
                inputWrapper:
                  "bg-white border border-gray-200 h-12 shadow-none",
              }}
            />

            <Select
              label="Status *"
              placeholder="Select Status"
              selectedKeys={[draft.status]}
              onSelectionChange={(keys) =>
                updateField("status", Array.from(keys)[0] as OrderState)
              }
              labelPlacement="outside"
              classNames={{
                label: "font-semibold text-gray-700 mb-1",
                trigger: "bg-white border border-gray-200 h-12 shadow-none",
              }}
            >
              <SelectItem key={OrderState.PENDING}>Pending</SelectItem>
              <SelectItem key={OrderState.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem key={OrderState.COMPLETED}>Completed</SelectItem>
              <SelectItem key={OrderState.CANCELLED}>Cancelled</SelectItem>
            </Select>
          </div>

          {/* Items Section */}
          <div className="space-y-6">
            {draft.items.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="bg-default-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-700">
                    Item #{index + 1}
                  </span>
                  {draft.items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    >
                      <BiTrash size={18} />
                    </button>
                  )}
                </div>

                <div className="p-5 space-y-5">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700">
                      Order Items
                    </label>
                    <div className="grid grid-cols-[1fr_100px_100px] gap-3">
                      <Select
                        placeholder="Select Item"
                        selectedKeys={item.menuItemId ? [item.menuItemId] : []}
                        onSelectionChange={(keys) =>
                          updateItem(
                            item.id,
                            "menuItemId",
                            Array.from(keys)[0] as string,
                          )
                        }
                        classNames={{
                          trigger:
                            "bg-white border border-gray-200 h-12 shadow-none",
                        }}
                      >
                        {/* Static items for now until API integration is complete */}
                        <SelectItem key="pizza">Pizza</SelectItem>
                        <SelectItem key="burger">Burger</SelectItem>
                        <SelectItem key="pasta">Pasta</SelectItem>
                      </Select>

                      <Input
                        type="number"
                        min={1}
                        value={item.quantity.toString()}
                        onValueChange={(val) =>
                          updateItem(item.id, "quantity", parseInt(val) || 1)
                        }
                        classNames={{
                          inputWrapper:
                            "bg-white border border-gray-200 h-12 shadow-none",
                          input: "text-center",
                        }}
                      />

                      <Button
                        color="primary"
                        className="h-12 font-bold bg-[#1a73e8] "
                        startContent={<BiPlus size={20} />}
                        onPress={() =>
                          updateItem(item.id, "quantity", item.quantity + 1)
                        }
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700">
                      Special Notes
                    </label>
                    <Textarea
                      placeholder="Any special instructions..."
                      value={item.specialNotes}
                      onValueChange={(val) =>
                        updateItem(item.id, "specialNotes", val)
                      }
                      classNames={{
                        inputWrapper:
                          "bg-white border border-gray-200 shadow-none",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add another item button (dashed) */}
            <button
              onClick={addItem}
              className="w-full border-2 border-dashed border-gray-300 bg-default-100 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all group"
            >
              <div className="p-3 border-2 bg-white border-gray-300 rounded-full group-hover:border-blue-400 transition-all">
                <BiPlus size={28} />
              </div>
              <span className="font-bold text-lg">Add another Item</span>
            </button>
          </div>
        </ModalBody>

        <ModalFooter className="gap-4">
          <Button
            variant="light"
            onPress={closeModal}
            className="h-12 px-8 font-bold text-gray-600 bg-gray-50 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleCreateOrder}
            isLoading={isCreating}
            className="h-12 px-8 font-bold bg-[#1a73e8] shadow-lg shadow-blue-200"
          >
            Create Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateOrderModal;
