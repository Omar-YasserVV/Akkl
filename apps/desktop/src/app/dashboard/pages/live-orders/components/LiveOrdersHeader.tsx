import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { BiPlus, BiX, BiTrash } from "react-icons/bi";
import { useLiveOrdersStore } from "@/store/liveOrdersFilterStore";

const LiveOrdersHeader = () => {
  const {
    isCreateModalOpen,
    setCreateModalOpen,
    newOrderDraft,
    updateDraftField,
    addDraftItem,
    updateDraftItem,
    removeDraftItem,
    resetDraft,
    addOrder,
  } = useLiveOrdersStore();

  const handleCreateOrder = () => {
    // Basic validation
    if (!newOrderDraft.orderNumber || !newOrderDraft.customerName) {
      alert("Please fill in the order number and customer name");
      return;
    }

    // Creating the LiveOrder object
    const totalItems = newOrderDraft.items.reduce((acc, item) => acc + item.quantity, 0);
    // Simple total calculation for demonstration
    const totalCost = totalItems * 15.99;

    addOrder({
      id: `${newOrderDraft.orderNumber}-${Date.now()}`,
      "order#": newOrderDraft.orderNumber,
      customer: newOrderDraft.customerName,
      source: "Restaurant",
      items: totalItems,
      total: totalCost,
      status: newOrderDraft.status,
    });

    closeModal();
  };

  const closeModal = () => {
    setCreateModalOpen(false);
    resetDraft();
  };

  return (
    <header className="flex justify-between items-end">
      <div className="space-y-2.5">
        <h2 className="font-cherry text-primary text-5xl">Live Orders</h2>
        <p className="text-muted-foreground">
          Manage orders from app and restaurant in real-time.
        </p>
      </div>
      <Button
        onPress={() => setCreateModalOpen(true)}
        className="bg-primary rounded-lg px-3 text-white py-3"
      >
        <BiPlus />
        New Order
      </Button>

      <Modal
        isOpen={isCreateModalOpen}
        placement="top-center"
        onOpenChange={(isOpen) => !isOpen && closeModal()}
        size="lg"
        hideCloseButton
        scrollBehavior="inside"
      >
        <ModalContent className="rounded-lg shadow-xl">
          <ModalHeader className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">
              Create New Order
            </h3>
            <button
              type="button"
              aria-label="Close"
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              onClick={closeModal}
            >
              <BiX size={24} />
            </button>
          </ModalHeader>
          <ModalBody className="py-6 px-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Order Number *"
                placeholder="#ORD001"
                value={newOrderDraft.orderNumber}
                onValueChange={(val) => updateDraftField("orderNumber", val)}
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
                classNames={{
                  label: "text-xs font-bold text-gray-700 mb-1.5",
                  inputWrapper: "border-gray-200 focus-within:!border-primary",
                }}
              />
              <Input
                label="Customer Name *"
                placeholder="John Doe"
                value={newOrderDraft.customerName}
                onValueChange={(val) => updateDraftField("customerName", val)}
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
                classNames={{
                  label: "text-xs font-bold text-gray-700 mb-1.5",
                  inputWrapper: "border-gray-200 focus-within:!border-primary",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Source *"
                value="Restaurant"
                isDisabled
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
                classNames={{
                  label: "text-xs font-bold text-gray-700 mb-1.5",
                  inputWrapper: "border-gray-200 bg-gray-50",
                }}
              />
              <Select
                label="Status *"
                placeholder="Pending"
                variant="bordered"
                radius="sm"
                selectedKeys={[newOrderDraft.status]}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string;
                  updateDraftField("status", val as any);
                }}
                labelPlacement="outside"
                disallowEmptySelection
                classNames={{
                  label: "text-xs font-bold text-gray-700 mb-1.5",
                  trigger: "border-gray-200 h-10 min-h-10",
                }}
              >
                <SelectItem key="pending">Pending</SelectItem>
                <SelectItem key="cooking">Cooking</SelectItem>
                <SelectItem key="ready">Ready</SelectItem>
              </Select>
            </div>

            {/* Dynamic Items List */}
            <div className="space-y-4">
              {newOrderDraft.items.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-gray-100 bg-card overflow-hidden transition-all duration-200 hover:border-gray-200">
                  <div className="bg-gray-100/80 px-4 py-2 text-sm font-bold text-gray-700 flex justify-between items-center">
                    <span>Item #{index + 1}</span>
                    {newOrderDraft.items.length > 1 && (
                      <button
                        onClick={() => removeDraftItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <BiTrash size={16} />
                      </button>
                    )}
                  </div>
                  <div className="px-5 py-5 space-y-4 bg-white">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-700">
                        Order Items
                      </p>
                      <div className="grid grid-cols-[minmax(0,1fr)_80px_auto] gap-3">
                        <Select
                          placeholder="Select Item"
                          radius="sm"
                          variant="bordered"
                          size="sm"
                          selectedKeys={item.itemId ? [item.itemId] : []}
                          onSelectionChange={(keys) => {
                            const val = Array.from(keys)[0] as string;
                            updateDraftItem(item.id, "itemId", val);
                          }}
                          classNames={{
                            trigger: "h-10 min-h-10 border-gray-200",
                          }}
                        >
                          <SelectItem key="pizza">Pizza</SelectItem>
                          <SelectItem key="burger">Burger</SelectItem>
                          <SelectItem key="pasta">Pasta</SelectItem>
                        </Select>
                        <Input
                          type="number"
                          placeholder="1"
                          radius="sm"
                          variant="bordered"
                          size="sm"
                          value={item.quantity.toString()}
                          onValueChange={(val) => updateDraftItem(item.id, "quantity", parseInt(val) || 0)}
                          classNames={{
                            inputWrapper: "h-10 border-gray-200",
                          }}
                        />
                        <Button
                          color="primary"
                          radius="sm"
                          size="sm"
                          className="text-sm font-bold bg-primary px-4 h-10"
                        >
                          <BiPlus size={18} className="mr-1" /> Add
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-700">
                        Special Notes
                      </p>
                      <Textarea
                        placeholder="Any special instructions..."
                        radius="sm"
                        variant="bordered"
                        minRows={2}
                        value={item.notes}
                        onValueChange={(val) => updateDraftItem(item.id, "notes", val)}
                        classNames={{
                          inputWrapper: "border-gray-200 focus-within:!border-primary",
                          input: "text-sm",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add another item logic */}
            <button
              onClick={addDraftItem}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-default-300 bg-card py-4 text-sm text-gray-400 hover:bg-gray-100/50 hover:border-gray-300 transition-all duration-200"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-default-400 bg-white shadow-sm">
                <BiPlus size={20} />
              </span>
              Add another Item
            </button>
          </ModalBody>
          <ModalFooter className="px-6 py-6 border-t border-gray-100 gap-3">
            <Button
              variant="bordered"
              radius="sm"
              className="border-gray-200 text-md px-6 py-5"
              onPress={closeModal}
            >
              Cancel
            </Button>
            <Button
              variant="bordered"
              color="primary"
              radius="sm"
              className="bg-primary-500 border-primary-500 text-white text-md px-6 py-5"
              onPress={handleCreateOrder}
            >
              Create Order
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </header>
  );
};

export default LiveOrdersHeader;
