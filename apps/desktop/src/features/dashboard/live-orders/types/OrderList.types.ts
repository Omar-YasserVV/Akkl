import { OrderState } from "@repo/types";
import { columns } from "../constants/StatsCard.constants";
import { Order } from "../types/LiveOrders.types";

export type ColumnKey = (typeof columns)[number]["uid"];

export interface OrderCellProps {
  order: Order;
  columnKey: React.Key;
}

export type DraftItem = {
  id: string;
  menuItemId: string;
  quantity: number;
  specialNotes: string;
};

export type CreateOrderDraft = {
  CustomerName: string;
  status: OrderState;
  items: DraftItem[];
};
