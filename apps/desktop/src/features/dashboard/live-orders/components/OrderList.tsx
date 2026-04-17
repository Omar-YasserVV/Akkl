import {
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import React, { useCallback, useMemo, useState } from "react";

import Chip from "@repo/ui/components/chip";
import { BiMobile } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { LuChefHat, LuCircleCheck, LuClock8 } from "react-icons/lu";

// --- Types & Mock Data ---
export type OrderStatus = "pending" | "cooking" | "ready";

export interface LiveOrder {
  id: string;
  "order#": string;
  customer: string;
  source: "App" | "Store";
  items: number;
  total: number;
  status: OrderStatus;
}

const MOCK_ORDERS: LiveOrder[] = [
  {
    id: "1",
    "order#": "1001",
    customer: "John Doe",
    source: "App",
    items: 2,
    total: 25.5,
    status: "pending",
  },
  {
    id: "2",
    "order#": "1002",
    customer: "Jane Smith",
    source: "Store",
    items: 1,
    total: 12.0,
    status: "cooking",
  },
  {
    id: "3",
    "order#": "1003",
    customer: "Bob Wilson",
    source: "App",
    items: 4,
    total: 45.2,
    status: "ready",
  },
];

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

// --- Sub-components ---

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
  const colors = {
    pending: "status-pill-pending",
    cooking: "status-pill-cooking",
    ready: "status-pill-ready",
  };
  const currentClass = colors[status];

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
        trigger: `${currentClass} w-fit min-w-[120px] h-7 min-h-7 px-3 shadow-none border-none transition-none overflow-hidden`,
        value: "text-xs font-medium text-inherit!",
        selectorIcon: "text-inherit! h-3 w-3",
        popoverContent: "min-w-[130px] p-1",
      }}
      renderValue={() => (
        <div className="flex items-center gap-2 text-inherit!">
          <Icon className="h-4 w-4 text-inherit!" />
          <span className="text-inherit!">{cfg.label}</span>
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

// --- Main Component ---

const OrderList = () => {
  // Prototype States
  const [orders, setOrders] = useState<LiveOrder[]>(MOCK_ORDERS);
  const [sourceFilter] = useState<string>("all");
  const [statusFilter] = useState<string>("all");

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order,
      ),
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSource =
        sourceFilter === "all" || order.source === sourceFilter;
      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchSource && matchStatus;
    });
  }, [orders, sourceFilter, statusFilter]);

  const renderCell = useCallback((order: LiveOrder, columnKey: React.Key) => {
    const key = columnKey as ColumnKey;
    switch (key) {
      case "order#":
        return (
          <span className="font-semibold text-black">#{order["order#"]}</span>
        );
      case "customer":
        return <span className="text-black">{order.customer}</span>;
      case "source":
        return <Chip value="APP" startContent={<BiMobile />} />;
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
            onChange={(val) => updateOrderStatus(order.id, val)}
          />
        );
      case "actions":
        return (
          <div className="flex items-center gap-3">
            <Tooltip content="Edit">
              <button
                type="button"
                className="h-9 w-9 rounded-sm border border-gray-100 bg-white text-gray-700 inline-flex items-center justify-center hover:bg-gray-50"
              >
                <FiEdit className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <button
                onClick={() => deleteOrder(order.id)}
                type="button"
                className="h-9 w-9 rounded-sm border border-gray-100 bg-white text-rose-500 inline-flex items-center justify-center hover:bg-rose-50"
              >
                <FaRegTrashAlt className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  }, []);

  return (
    <div className="w-full rounded-lg font-normal text-black border border-gray-100 bg-white overflow-hidden shadow-sm">
      <Table
        aria-label="Live orders table"
        removeWrapper
        classNames={{
          table: "min-w-full",
          thead: "rounded-b-none",
          th: "bg-neutral-100 !rounded-none text-black text-xs font-semibold py-3 px-6 text-left border-b border-gray-100",
          td: "py-5 px-6",
          tr: "border-b border-gray-100 last:border-0",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.align}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={filteredOrders} emptyContent="No orders yet.">
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
