import { useFormContext } from "react-hook-form";
import { Button, ModalFooter } from "@heroui/react";
import { ApiError } from "@repo/utils";
import type { AddMenuItemFormData } from "../../types/AddItem";

interface AddModalFooterProps {
  onClose: () => void;
  onSubmit?: (data: AddMenuItemFormData) => void | Promise<void>;
}

function AddModalFooter({ onClose, onSubmit }: AddModalFooterProps) {
  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useFormContext<AddMenuItemFormData>();

  const onValid = async (data: AddMenuItemFormData) => {
    clearErrors("root");
    try {
      if (onSubmit) await onSubmit(data);
      onClose();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not save the menu item.";
      setError("root", { type: "server", message });
    }
  };

  return (
    <ModalFooter className="flex flex-col gap-2 px-8 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
      {errors.root?.message ? (
        <p className="w-full text-sm text-danger">{errors.root.message}</p>
      ) : null}
      <div className="flex w-full justify-end gap-2">
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
          onPress={() => void handleSubmit(onValid)()}
          className="bg-blue-600 text-sm h-11 font-bold px-10 rounded-xl shadow-lg shadow-blue-200/50 hover:bg-blue-700 transition-all active:scale-95"
        >
          Save Item
        </Button>
      </div>
    </ModalFooter>
  );
}

export default AddModalFooter;
