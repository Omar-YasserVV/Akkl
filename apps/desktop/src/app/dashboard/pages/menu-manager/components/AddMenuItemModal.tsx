import { Modal, ModalContent, ModalBody } from "@heroui/react";
import { BiX } from "react-icons/bi";
import { FormProvider } from "react-hook-form";
import AddModalHeader from "./AddModal/AddModalHeader";
import AddModalFooter from "./AddModal/AddModalFooter";
import { useAddMenuItemForm } from "../hooks/useAddMenuItemForm";
import { useAddMenuItemModalStore } from "../stores/useAddMenuItemModalStore";
import BasicInfoSection from "./AddModal/BasicInfoSection";
import VariationsSection from "./AddModal/VariationsSection";
import ModifiersSection from "./AddModal/ModifiersSection";
import DietaryAndAvailabilitySection from "./AddModal/DietaryAndAvailabilitySection";
import type { AddMenuItemFormData } from "../types/types";

export type { AddMenuItemFormData };

export interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddMenuItemFormData) => void;
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
      size="3xl"
      scrollBehavior="inside"
      closeButton={<BiX className="text-2xl" />}
      classNames={{
        base: "max-h-[95vh] rounded-[20px]",
        header: "border-b py-4",
        footer: "border-t py-4 bg-white",
      }}
    >
      <ModalContent>
        {(modalOnClose) => {
          const close = () => {
            handleClose();
            modalOnClose();
          };
          return (
            <FormProvider {...methods}>
              <AddModalHeader />
              <ModalBody className="py-6 px-8 bg-[#fafafa]">
                <BasicInfoSection />
                <VariationsSection />
                <ModifiersSection />
                <DietaryAndAvailabilitySection />
              </ModalBody>
              <AddModalFooter onClose={close} onSubmit={onSubmit} />
            </FormProvider>
          );
        }}
      </ModalContent>
    </Modal>
  );
}
