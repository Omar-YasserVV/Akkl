import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { Button, ModalFooter } from "@heroui/react";
import type { AddMenuItemFormData } from "../../types/types";

interface AddModalFooterProps {
  onClose: () => void;
  onSubmit?: (data: AddMenuItemFormData) => void;
}

function AddModalFooterInner({ onClose, onSubmit }: AddModalFooterProps) {
  const { handleSubmit } = useFormContext<AddMenuItemFormData>();

  const onValid = (data: AddMenuItemFormData) => {
    onSubmit?.(data);
    onClose();
  };

  return (
    <ModalFooter className="px-8 py-5 border-t-[#E2E8F0] rounded-lg">
      <Button
        variant="light"
        onPress={onClose}
        className="font-bold text-[#64748B] py-6"
      >
        Cancel
      </Button>
      <Button
        color="primary"
        className="bg-primary text-sm py-6 font-bold px-10 rounded-xl shadow-lg shadow-blue-200"
        onPress={() => handleSubmit(onValid)()}
      >
        Save Item
      </Button>
    </ModalFooter>
  );
}

const AddModalFooter = memo(AddModalFooterInner);
export default AddModalFooter;
