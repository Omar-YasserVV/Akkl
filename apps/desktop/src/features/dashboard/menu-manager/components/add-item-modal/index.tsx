import { Modal, ModalContent, ModalBody } from "@heroui/react";
import { BiX } from "react-icons/bi";
import { FormProvider } from "react-hook-form";
import AddModalHeader from "./AddModalHeader";
import AddModalFooter from "./AddModalFooter";
import { useAddMenuItemForm } from "../../hooks/useAddMenuItemForm";
import { useAddMenuItemModalStore } from "../../stores/useAddMenuItemModalStore";
import BasicInfoSection from "./BasicInfoSection";
import VariationsSection from "./VariationsSection";
import ModifiersSection from "./ModifiersSection";
import DietaryAndAvailabilitySection from "./DietaryAndAvailabilitySection";
import RecipeSection from "./RecipeSection";
import type { AddMenuItemFormData } from "../../types/AddItem";

export interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddMenuItemFormData) => void | Promise<void>;
}

export default function AddMenuItemModal({
  isOpen,
  onClose,
  onSubmit,
}: AddMenuItemModalProps) {
  const methods = useAddMenuItemForm();
  const resetUI = useAddMenuItemModalStore((s) => s.reset);

  const handleClose = () => {
    methods.reset();
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
              <AddModalHeader onClose={OnClose} />
              <ModalBody className="py-6 px-8 bg-default-50">
                <BasicInfoSection />
                <VariationsSection />
                <RecipeSection />
                <ModifiersSection />
                <DietaryAndAvailabilitySection />
              </ModalBody>
              <AddModalFooter onClose={OnClose} onSubmit={onSubmit} />
            </FormProvider>
          );
        }}
      </ModalContent>
    </Modal>
  );
}
