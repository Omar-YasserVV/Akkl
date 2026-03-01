import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  type LiveOrder,
  type OrderStatus,
} from "../constants/constants";
import { useLiveOrdersStore, type OrderRow } from "@/store/liveOrdersFilterStore";
import { LuChefHat, LuClock8, LuCircleCheck } from "react-icons/lu";
import { CgSmartphone } from "react-icons/cg";
import { BiStore } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

type ColumnKey =
  | "order#"
  | "customer"
  | "source"
  | "items"
  | "total"
  | "status"
  | "actions";

const columns: Array<{
  name: string;
  uid: ColumnKey;
  align?: "start" | "center" | "end";
}> = [
    { name: "Order #", uid: "order#", align: "start" },
    { name: "Customer", uid: "customer", align: "start" },
    { name: "Source", uid: "source", align: "start" },
    { name: "Items", uid: "items", align: "start" },
    { name: "Total", uid: "total", align: "start" },
    { name: "Status", uid: "status", align: "start" },
    { name: "Actions", uid: "actions", align: "start" },
  ];

const statusChipMap: Record<OrderStatus, { label: string; className: string }> =
{
  pending: { label: "Pending", className: "bg-amber-100 text-[#746A0C]" },
  cooking: { label: "Cooking", className: "bg-orange-100 text-orange-900" },
  ready: { label: "Ready", className: "bg-green-100 text-green-800" },
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

const StatusSelect = ({
  status,
  onChange,
}: {
  status: OrderStatus;
  onChange: (status: OrderStatus) => void;
}) => {
  const cfg = statusChipMap[status];
  const Icon =
    status === "pending"
      ? LuClock8
      : status === "cooking"
        ? LuChefHat
        : LuCircleCheck;

  return (
    <Select
      aria-label="Change status"
      selectedKeys={[status]}
      onSelectionChange={(keys) => {
        const val = Array.from(keys)[0] as OrderStatus;
        if (val) onChange(val);
      }}
      variant="flat"
      radius="full"
      size="sm"
      disallowEmptySelection
      classNames={{
        trigger: `${cfg.className.split(" ").map((c) => `!${c}`).join(" ")} h-8 min-h-8 w-32 px-3 shadow-none`,
        value: "text-xs font-medium !text-inherit",
        selectorIcon: "!text-inherit h-3 w-3",
        popoverContent: "min-w-[130px] p-1",
      }}
      renderValue={() => (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{cfg.label}</span>
        </div>
      )}
    >
      <SelectItem
        key="pending"
        textValue="Pending"
        startContent={<LuClock8 className="h-4 w-4" />}
        className="text-amber-700 data-[hover=true]:bg-amber-50"
      >
        Pending
      </SelectItem>
      <SelectItem
        key="cooking"
        textValue="Cooking"
        startContent={<LuChefHat className="h-4 w-4" />}
        className="text-orange-900 data-[hover=true]:bg-orange-50"
      >
        Cooking
      </SelectItem>
      <SelectItem
        key="ready"
        textValue="Ready"
        startContent={<LuCircleCheck className="h-4 w-4" />}
        className="text-green-800 data-[hover=true]:bg-green-50"
      >
        Ready
      </SelectItem>
    </Select>
  );
};

const SourceChip = ({ source }: { source: LiveOrder["source"] }) => {
  const isApp = source === "App";
  const Icon = isApp ? CgSmartphone : BiStore;
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium " +
        (isApp ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700")
      }
    >
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full">
        <Icon className="h-4 w-4" />
      </span>
      {source}
    </span>
  );
};

const OrderList = () => {
  const orders = useLiveOrdersStore((state) => state.orders);
  const updateOrderStatus = useLiveOrdersStore((state) => state.updateOrderStatus);

  const renderCell = React.useCallback(
    (order: OrderRow, columnKey: React.Key) => {
      const key = columnKey as ColumnKey;

      switch (key) {
        case "order#":
          return (
            <span className="font-semibold text-black">#{order["order#"]}</span>
          );
        case "customer":
          return <span className="text-black">{order.customer}</span>;
        case "source":
          return <SourceChip source={order.source} />;
        case "items":
          return (
            <span className="text-black">
              {order.items} {order.items === 1 ? "item" : "items"}
            </span>
          );
        case "total":
          return (
            <span className="text-black tabular-nums">
              {formatMoney(order.total)}
            </span>
          );
        case "status":
          return (
            <StatusSelect
              status={order.status}
              onChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
            />
          );
        case "actions":
          return (
            <div className="flex items-center gap-3">
              <Tooltip content="Edit">
                <button
                  type="button"
                  className="h-9 w-9 rounded-sm border border-gray-100 bg-white text-gray-700 inline-flex items-center justify-center hover:bg-gray-50"
                  aria-label="Edit order"
                >
                  <FiEdit className="h-4 w-4" />
                </button>
              </Tooltip>

              <Tooltip color="danger" content="Delete">
                <button
                  type="button"
                  className="h-9 w-9 rounded-sm border border-gray-100 bg-white text-rose-500 inline-flex items-center justify-center hover:bg-rose-50"
                  aria-label="Delete order"
                >
                  <FaRegTrashAlt className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
          );
        default:
          return null;
      }
    },
    [updateOrderStatus],
  );

  return (
    <div className="w-full rounded-lg font-normal text-black border border-gray-100 bg-white overflow-hidden shadow-sm">
      <Table
        aria-label="Live orders table"
        removeWrapper
        classNames={{
          table: "min-w-full",
          thead: "rounded-b-none",
          // Added 'text-left' to ensure headers aren't centered by default
          th: "bg-neutral-100 !rounded-none text-black text-xs font-semibold py-3 px-6 text-left border-b border-gray-100",
          td: "py-5 px-6",
          tr: "border-b border-gray-100 last:border-0",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              // Ensure align is strictly "start"
              align={column.align}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={orders} emptyContent="No orders yet.">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderList;
