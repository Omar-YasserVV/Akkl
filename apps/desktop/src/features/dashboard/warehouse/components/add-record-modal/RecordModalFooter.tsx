import { useFormContext } from "react-hook-form";
import { Button, ModalFooter } from "@heroui/react";
import type { UsageRecordFromData } from "../../types/AddRecord";

interface RecordModalFooterProps {
  onClose: () => void;
}

function RecordModalFooter({ onClose }: RecordModalFooterProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext<UsageRecordFromData>();

  return (
    <ModalFooter className="px-8 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
      <Button
        variant="bordered"
        size="lg"
        radius="sm"
        onPress={onClose}
        className="font-bold"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        size="lg"
        radius="sm"
        isLoading={isSubmitting}
        className="bg-primary font-bold text-white   hover:bg-primary/45 transition-all active:scale-95"
      >
        Record Usage
      </Button>
    </ModalFooter>
  );
}

export default RecordModalFooter;
