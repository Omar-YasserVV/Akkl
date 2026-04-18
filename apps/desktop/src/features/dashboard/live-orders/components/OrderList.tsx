import { useOrderStore } from "@/store/OrderStore";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { columns } from "../constants/StatsCard.constants";
import { useOrders } from "../hooks/useLiveOrders";
import { OrderCell } from "./RenderCell";

const OrderList = () => {
  const filters = useOrderStore((state) => state.filters);
  const { data, isLoading } = useOrders(filters);

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
        <TableBody
          items={data?.data || []}
          emptyContent={isLoading ? <Spinner /> : "No orders yet."}
          isLoading={isLoading}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  <OrderCell order={item} columnKey={columnKey} />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderList;
