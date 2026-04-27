import { OrderState } from "@repo/types";

export interface CreateOrderBody {
  CustomerName: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  status: OrderState;
  userId: string;
}
export interface OrdersStats {
  PENDING: number;
  COMPLETED: number;
  IN_PROGRESS: number;
  CANCELLED: number;
}

export interface BranchMenuItemVariation {
  id: string;
  size: string;
  price: string;
  discountPrice?: string | null;
}

export interface BranchMenuItem {
  id: string;
  menuItemId: string;
  name: string;
  description?: string | null;
  image?: string | null;
  isAvailable: boolean;
  variations: BranchMenuItemVariation[];
}
