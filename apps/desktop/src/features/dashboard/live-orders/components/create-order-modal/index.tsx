import { useBranchMenu } from "@/hooks/Menu/FetchMenu";
import { useAuthStore } from "@/store/AuthStore";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { BiPlus, BiX } from "react-icons/bi";
import {
  createDraftItem,
  createInitialDraft,
} from "../../constants/createOrderModal.constants";
import { useCreateOrder } from "../../hooks/useLiveOrders";
import { CreateOrderDraft, DraftItem } from "../../types/OrderList.types";
import OrderInfoFields from "./OrderInfoFields";
import OrderItemCard from "./OrderItemCard";

const CreateOrderModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const user = useAuthStore((state) => state.user);
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
  const { data: branchMenu = [], isLoading: isLoadingMenu } = useBranchMenu();

  const [draft, setDraft] = useState<CreateOrderDraft>(createInitialDraft);

  const closeModal = () => {
    onClose();
    setDraft(createInitialDraft());
  };

  const updateField = <K extends keyof CreateOrderDraft>(
    field: K,
    value: CreateOrderDraft[K],
  ) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = <K extends keyof DraftItem>(
    id: string,
    field: K,
    value: DraftItem[K],
  ) => {
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
      items: [...prev.items, createDraftItem()],
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
          <OrderInfoFields draft={draft} onFieldChange={updateField} />

          <div className="space-y-6">
            {draft.items.map((item, index) => (
              <OrderItemCard
                key={item.id}
                item={item}
                index={index}
                canRemove={draft.items.length > 1}
                menuItems={(Array.isArray(branchMenu)
                  ? branchMenu
                  : branchMenu?.data || []
                ).filter(
                  (menuItem) =>
                    menuItem.isAvailable && menuItem.variations.length > 0,
                )}
                isLoadingMenuItems={isLoadingMenu}
                onRemove={removeItem}
                onItemChange={updateItem}
              />
            ))}

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
