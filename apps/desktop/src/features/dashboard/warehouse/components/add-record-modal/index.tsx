import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { FormProvider } from "react-hook-form";
import { BiX } from "react-icons/bi";
import { useAddRecordFrom } from "../../hooks/useAddRecordFrom";
import RecordModalHeader from "./RecordModalHeader";
import RecordModalFooter from "./RecordModalFooter";
import { UsageRecordFromData } from "../../types/AddRecord";

export interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: UsageRecordFromData) => void;
}
const AddRecordModal = ({ isOpen, onClose, onSubmit }: AddRecordModalProps) => {
  const handleClose = () => {
    onClose();
    methods.reset();
  };
  const methods = useAddRecordFrom();

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
              <RecordModalHeader onClose={OnClose} />
              <ModalBody className="py-6 px-8 bg-default-50"></ModalBody>
              <RecordModalFooter onClose={OnClose} onSubmit={onSubmit} />
            </FormProvider>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

export default AddRecordModal;
