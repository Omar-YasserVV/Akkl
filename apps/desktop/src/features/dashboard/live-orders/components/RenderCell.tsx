import { Order } from "@/types/Order";
import { orderIdFormat } from "@/utils/OrderIdFormatter";
import { Spinner, Tooltip } from "@heroui/react";
import Chip from "@repo/ui/components/chip";
import { NumberFormatter } from "@repo/utils";
import { useCallback, useState } from "react";
import { BiMobile } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useDeleteOrder, useUpdateOrder } from "../hooks/useLiveOrders";
import { ColumnKey, OrderCellProps } from "../types/OrderList.types";
import { StatusSelect } from "./StatusSelect";
import CreateOrderModal from "./create-order-modal";

export const OrderCell = ({ order, columnKey }: OrderCellProps) => {
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleUpdateStatus = useCallback(
    (status: Order["status"]) => {
      updateOrder({ orderId: order.id, data: { status } });
    },
    [updateOrder, order.id],
  );

  const handleDelete = useCallback(() => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder(order.id);
    }
  }, [deleteOrder, order.id]);

  const key = columnKey as ColumnKey;

  switch (key) {
    case "order#":
      return (
        <span className="font-semibold text-black">
          {orderIdFormat(order.orderNumber)}
        </span>
      );
    case "customer":
      return <span className="text-black">{order.CustomerName}</span>;
    case "source":
      return (
        <Chip
          value={order.source}
          startContent={order.source === "APP" ? <BiMobile /> : null}
        />
      );
    case "items":
      return (
        <span className="text-black">
          {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
        </span>
      );
    case "total":
      return (
        <span className="text-black tabular-nums">
          {NumberFormatter.getNumberOnly(parseFloat(order.totalPrice), {
            isCurrency: true,
          })}
        </span>
      );
    case "status":
      return (
        <StatusSelect
          status={order.status}
          isLoading={isUpdating}
          onChange={handleUpdateStatus}
        />
      );
    case "actions":
      return (
        <div className="flex items-center gap-3">
          <Tooltip content="Edit">
            <button
              onClick={() => setCreateModalOpen(true)}
              type="button"
              className="h-9 w-9 cursor-pointer rounded-sm border border-gray-100 bg-white text-gray-700 inline-flex items-center justify-center hover:bg-gray-50"
            >
              <FiEdit className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip color="danger" content="Delete">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              type="button"
              className="h-9 w-9 cursor-pointer rounded-sm border border-gray-100 bg-white text-rose-500 inline-flex items-center justify-center hover:bg-rose-50 disabled:opacity-50"
            >
              {isDeleting ? (
                <Spinner size="sm" color="danger" />
              ) : (
                <FaRegTrashAlt className="h-4 w-4" />
              )}
            </button>
          </Tooltip>
          <CreateOrderModal
            orderToEdit={order}
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
          />
        </div>
      );
    default:
      return null;
  }
};
