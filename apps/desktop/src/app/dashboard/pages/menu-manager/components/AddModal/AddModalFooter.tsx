import { Button, ModalFooter } from "@heroui/react";

function AddModalFooter({ onClose }) {
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
      >
        Save Item
      </Button>
    </ModalFooter>
  );
}

export default AddModalFooter;
