import {
  DASHBOARD_TABLE_SKELETON_CELL_CLASSNAME,
  DashboardTableLoadingOverlay,
  createDashboardTableLoadingRows,
} from "@/features/dashboard/components/shared/DashboardTableLoading";
import { useOrders } from "@/hooks/Orders/FetchOrders";
import { Order } from "@/types/Order";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { columns } from "../constants/StatsCard.constants";
import { useOrderStore } from "../store/OrderStore";
import { OrderCell } from "./RenderCell";

const loadingRows = createDashboardTableLoadingRows();

const OrderList = () => {
  const filters = useOrderStore((state) => state.filters);
  const { data, isLoading, isFetching } = useOrders(filters);
  const orders: Order[] = data?.data ?? [];

  return (
    <div className="relative w-full rounded-lg font-normal text-black border border-gray-100 bg-white overflow-hidden shadow-sm">
      <Table
        aria-label="Live orders table"
        removeWrapper
        classNames={{
          table: "min-w-full",
          thead: "rounded-b-none",
          th: "bg-neutral-100 !rounded-none text-black text-xs font-semibold py-3 px-6 text-left border-b border-gray-100",
          td: "py-5 px-6",
          tr: `border-b border-gray-100 last:border-0 ${isFetching && !isLoading ? "opacity-40" : ""}`,
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.align}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        {isLoading ? (
          <TableBody items={loadingRows}>
            {(item) => (
              <TableRow key={item.id}>
                {() => (
                  <TableCell>
                    <Skeleton
                      className={DASHBOARD_TABLE_SKELETON_CELL_CLASSNAME}
                    />
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody<Order> items={orders} emptyContent="No orders yet.">
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
        )}
      </Table>
      {/* //TODO:Omar maybe move it to be reusable later*/}
      {isFetching && !isLoading && (
        <DashboardTableLoadingOverlay className="absolute inset-0 top-10.25 flex items-center justify-center bg-white/50 backdrop-blur-[2px] z-10" />
      )}
    </div>
  );
};

export default OrderList;
