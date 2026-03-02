import { useFormContext } from "react-hook-form";
import { Button, ModalFooter } from "@heroui/react";
import type { AddMenuItemFormData } from "../../types/AddItem";

interface AddModalFooterProps {
  /**
   * Callback to close the modal dialog.
   */
  onClose: () => void;
  /**
   * Optional submit handler for form data.
   * If not provided, only closes the modal on submit.
   */
  onSubmit?: (data: AddMenuItemFormData) => void | Promise<void>;
}

/**
 * Footer component for the Add Menu Item modal.
 * Provides Cancel and Save Item buttons.
 * Utilizes react-hook-form context for submission and loading state.
 *
 * @param onClose - function to close the modal
 * @param onSubmit - optional function to handle form submission
 */
function AddModalFooter({ onClose, onSubmit }: AddModalFooterProps) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<AddMenuItemFormData>();

  /**
   * Handles valid form submission.
   * Calls onSubmit if provided and then closes the modal.
   * Catches and logs any errors from submission.
   */
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
        type="submit" // Set type to submit for accessibility
        color="primary"
        isLoading={isSubmitting}
        // Use 'onPress' but trigger handleSubmit directly
        onPress={() => handleSubmit(onValid)()}
        className="bg-blue-600 text-sm h-11 font-bold px-10 rounded-xl shadow-lg shadow-blue-200/50 hover:bg-blue-700 transition-all active:scale-95"
      >
        Save Item
      </Button>
    </ModalFooter>
  );
}

export default AddModalFooter;
