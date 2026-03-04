import { Button } from "@heroui/react";
import { BiPlus } from "react-icons/bi";
import CreateOrderModal from "./create-order-modal";
import Header from "@/features/dashboard/components/shared/header";
import { useState } from "react";

const LiveOrdersHeader = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  return (
    <Header
      title="Live Orders"
      description="Manage orders from app and restaurant in real-time."
      right={
        <>
          <Button
            onPress={() => setCreateModalOpen(true)}
            className="bg-primary rounded-lg px-3 text-white py-3"
          >
            <BiPlus />
            New Order
          </Button>

          {/* The Modal is now a self-contained component */}
          <CreateOrderModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
          />
        </>
      }
    />
  );
};

export default LiveOrdersHeader;
