import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
} from "@heroui/react";
import { ChefHat, CircleCheck, Clock8, Smartphone, Store, SquarePen, Trash2 } from "lucide-react";
import { DUMMY_ORDERS, type LiveOrder, type OrderStatus } from "../constants/constants";

type OrderRow = LiveOrder & { id: string };
type ColumnKey = "order#" | "customer" | "source" | "items" | "total" | "status" | "actions";

const columns: Array<{ name: string; uid: ColumnKey; align?: "start" | "center" | "end" }> = [
    { name: "Order #", uid: "order#", align: "center" },
    { name: "Customer", uid: "customer", align: "center" },
    { name: "Source", uid: "source", align: "center" },
    { name: "Items", uid: "items", align: "center" },
    { name: "Total", uid: "total", align: "center" },
    { name: "Status", uid: "status", align: "start" },
    { name: "Actions", uid: "actions", align: "center" },
];

const statusChipMap: Record<OrderStatus, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-amber-100 text-[#746A0C]" },
    cooking: { label: "Cooking", className: "bg-orange-100 text-orange-800" },
    ready: { label: "Ready", className: "bg-green-100 text-green-800" },
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

const StatusChip = ({ status }: { status: OrderStatus }) => {
    const cfg = statusChipMap[status];
    const Icon = status === "pending" ? Clock8 : status === "cooking" ? ChefHat : CircleCheck;
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${cfg.className}`}
        >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full">
                <Icon className="h-4 w-4" />
            </span>
            {cfg.label}
        </span>
    );
};

const SourceChip = ({ source }: { source: LiveOrder["source"] }) => {
    const isApp = source === "App";
    const Icon = isApp ? Smartphone : Store;
    return (
        <span
            className={
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium " +
                (isApp ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700")
            }
        >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-ful">
                <Icon className="h-4 w-4" />
            </span>
            {source}
        </span>
    );
};

const OrderList = () => {
    const orders = React.useMemo<OrderRow[]>(
        () =>
            DUMMY_ORDERS.map((order, idx) => ({
                ...order,
                id: `${order["order#"]}-${order.status}-${idx}`,
            })),
        [],
    );

    const renderCell = React.useCallback((order: OrderRow, columnKey: React.Key) => {
        const key = columnKey as ColumnKey;

        switch (key) {
            case "order#":
                return <span className="font-semibold text-gray-800">#{order["order#"]}</span>;
            case "customer":
                return <span className="text-gray-800">{order.customer}</span>;
            case "source":
                return <SourceChip source={order.source} />;
            case "items":
                return (
                    <span className="text-gray-700">
                        {order.items} {order.items === 1 ? "item" : "items"}
                    </span>
                );
            case "total":
                return <span className="text-gray-800 tabular-nums">{formatMoney(order.total)}</span>;
            case "status":
                return <StatusChip status={order.status} />;
            case "actions":
                return (
                    <div className="flex items-center justify-center gap-3">
                        <button
                            type="button"
                            className="h-9 min-w-[100px] rounded-sm border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700  inline-flex items-center justify-between gap-2"
                            aria-label="Change status"
                        >
                            <span>{order.status === "pending" || order.status === "cooking" ? "Cooking" : "Ready"}</span>
                        </button>

                        <Tooltip content="Edit">
                            <button
                                type="button"
                                className="h-9 w-9 rounded-sm border border-gray-100 bg-white text-gray-700 inline-flex items-center justify-center hover:bg-gray-50"
                                aria-label="Edit order"
                            >
                                <SquarePen className="h-4 w-4" />
                            </button>
                        </Tooltip>

                        <Tooltip color="danger" content="Delete">
                            <button
                                type="button"
                                className="h-9 w-9 rounded-sm border border-gray-100 bg-white text-rose-500 inline-flex items-center justify-center hover:bg-rose-50"
                                aria-label="Delete order"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </Tooltip>
                    </div>
                );
            default:
                return null;
        }
    }, []);

    return (
        <div className="w-full rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
            <Table
                aria-label="Live orders table"
                removeWrapper
                classNames={{
                    table: "min-w-full",
                    // Added 'text-left' to ensure headers aren't centered by default
                    th: "bg-neutral-100 text-black text-sm font-semibold py-3 px-6 text-left border-b border-gray-100",
                    td: "py-5 px-6",
                    tr: "border-b border-gray-100 last:border-0",
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.align}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={orders} emptyContent="No orders yet.">
                    {(item) => (
                        <TableRow key={item.id} >
                            {(columnKey) => (
                                <TableCell align={"center"}>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default OrderList