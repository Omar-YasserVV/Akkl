import { columns } from "../constants/StatsCard.constants";
import { Order } from "../types/LiveOrders.types";

export type ColumnKey = (typeof columns)[number]["uid"];

export interface OrderCellProps {
  order: Order;
  columnKey: React.Key;
}
