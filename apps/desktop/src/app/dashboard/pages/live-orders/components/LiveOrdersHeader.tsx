import { Button } from "@heroui/react";
import { BiPlus } from "react-icons/bi";
import { useLiveOrdersStore } from "@/store/liveOrdersFilterStore";
import CreateOrderModal from "./create-order-modal";
import Header from "@/app/dashboard/components/shared/header";

const LiveOrdersHeader = () => {
  const setCreateModalOpen = useLiveOrdersStore(
    (state) => state.setCreateModalOpen,
  );

  return (
    <Header
      title="Live Orders"
      description="Manage orders from app and restaurant in real-time."
      action={
        <>
          <Button
            onPress={() => setCreateModalOpen(true)}
            className="bg-primary rounded-lg px-3 text-white py-3"
          >
            <BiPlus />
            New Order
          </Button>

          {/* The Modal is now a self-contained component */}
          <CreateOrderModal />
        </>
      }
    />
  );
};

export default LiveOrdersHeader;
