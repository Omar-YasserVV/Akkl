import { Order } from "@/types/Order";
import { OrderState } from "@repo/types";
import { columns } from "../constants/StatsCard.constants";

export type ColumnKey = (typeof columns)[number]["uid"];

export interface OrderCellProps {
  order: Order;
  columnKey: React.Key;
}
export type DraftItem = {
  id: string;
  menuItemId: string;
  quantity: number;
  specialInstructions: string | null; // This is for the overall order
};

export type CreateOrderDraft = {
  CustomerName: string;
  status: OrderState;
  items: DraftItem[];
};
