import { useFormContext } from "react-hook-form";
import { Button, ModalFooter } from "@heroui/react";
import type { AddMenuItemFormData } from "../../types/AddItem";

interface AddModalFooterProps {
  onClose: () => void;
  onSubmit?: (data: AddMenuItemFormData) => void | Promise<void>;
}

function AddModalFooter({ onClose, onSubmit }: AddModalFooterProps) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<AddMenuItemFormData>();

  const onValid = (data: AddMenuItemFormData) => {
    onSubmit?.(data);
    onClose();
  };

  return (
    <ModalFooter className="px-8 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
      <Button
        variant="light"
        onPress={onClose}
        className="font-bold text-slate-500 h-11 hover:bg-slate-200/50"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        color="primary"
        isLoading={isSubmitting}
        onPress={() => handleSubmit(onValid)()}
        className="bg-blue-600 text-sm h-11 font-bold px-10 rounded-xl shadow-lg shadow-blue-200/50 hover:bg-blue-700 transition-all active:scale-95"
      >
        Save Item
      </Button>
    </ModalFooter>
  );
}

export default AddModalFooter;
