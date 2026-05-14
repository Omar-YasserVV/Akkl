import { Button, ModalFooter } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import type { WarehouseModalFormData } from "../../types/WarehouseModal";

interface RecordModalFooterProps {
  onClose: () => void;
  isBusy?: boolean;
}

function RecordModalFooter({ onClose, isBusy }: RecordModalFooterProps) {
  const {
    formState: { isSubmitting },
    watch,
  } = useFormContext<WarehouseModalFormData>();

  const tab = watch("tab");
  const label =
    tab === "usage"
      ? "Record usage"
      : tab === "restock"
        ? "Apply restock"
        : "Create line";

  return (
    <ModalFooter className="px-8 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
      <Button
        variant="bordered"
        size="lg"
        radius="sm"
        onPress={onClose}
        className="font-bold"
        isDisabled={isBusy || isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        size="lg"
        radius="sm"
        isLoading={isBusy || isSubmitting}
        className="bg-primary font-bold text-white   hover:bg-primary/45 transition-all active:scale-95"
      >
        {label}
      </Button>
    </ModalFooter>
  );
}

export default RecordModalFooter;
