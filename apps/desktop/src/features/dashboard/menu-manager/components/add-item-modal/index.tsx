import { Modal, ModalBody, ModalContent } from "@heroui/react";
import type { BranchMenuItem } from "@/types/Menu";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { BiX } from "react-icons/bi";
import { ADD_MENU_ITEM_DEFAULT_VALUES } from "../../constants/formConfig";
import { useAddMenuItemForm } from "../../hooks/useAddMenuItemForm";
import { useAddMenuItemModalStore } from "../../stores/useAddMenuItemModalStore";
import type { AddMenuItemFormData } from "../../types/AddItem";
import { mapBranchMenuItemToAddMenuForm } from "../../utils/mapBranchMenuItemToAddMenuForm";
import AddModalFooter from "./AddModalFooter";
import AddModalHeader from "./AddModalHeader";
import BasicInfoSection from "./BasicInfoSection";
import RecipeSection from "./RecipeSection";
import VariationsSection from "./VariationsSection";

export interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddMenuItemFormData) => void | Promise<void>;
  itemToEdit?: BranchMenuItem | null;
}

export default function AddMenuItemModal({
  isOpen,
  onClose,
  onSubmit,
  itemToEdit,
}: AddMenuItemModalProps) {
  const methods = useAddMenuItemForm();
  const resetUI = useAddMenuItemModalStore((s) => s.reset);

  const itemToEditId = itemToEdit?.id;

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        methods.reset(mapBranchMenuItemToAddMenuForm(itemToEdit));
      } else {
        methods.reset(ADD_MENU_ITEM_DEFAULT_VALUES);
      }
    }
  }, [isOpen, itemToEditId, methods]);

  const handleClose = () => {
    methods.reset(ADD_MENU_ITEM_DEFAULT_VALUES);
    resetUI();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      onClose={handleClose}
      size="3xl"
      scrollBehavior="inside"
      closeButton={<BiX className="text-2xl" />}
      classNames={{
        base: "rounded-[20px]",
        header: "border-b py-4",
        footer: "border-t py-4 bg-white",
      }}
    >
      <ModalContent>
        {(OnClose) => {
          return (
            <FormProvider {...methods}>
              <AddModalHeader
                onClose={OnClose}
                title={itemToEdit ? "Edit Menu Item" : "Add New Menu Item"}
              />
              <ModalBody className="py-6 px-8 bg-default-50">
                <BasicInfoSection />
                <VariationsSection />
                <RecipeSection />
                {/* <ModifiersSection /> */}
                {/* <DietaryAndAvailabilitySection /> */}
              </ModalBody>
              <AddModalFooter onClose={OnClose} onSubmit={onSubmit} />
            </FormProvider>
          );
        }}
      </ModalContent>
    </Modal>
  );
}
