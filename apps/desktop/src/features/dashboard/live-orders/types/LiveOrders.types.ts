import { OrderState, Source } from "@repo/types";

export interface CreateOrderBody {
  CustomerName: string;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
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
export interface OrderFilters {
  page: number;
  limit: number;
  status?: OrderState;
  source?: Source;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    limit: number;
  };
}

export interface Order {
  id: string;
  totalPrice: string;
  branchId: string;
  userId: string;
  CustomerName: string;
  source: Source;
  itemCount: number;
  status: OrderState;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    orderId: string;
    menuItemId: string;
    quantity: number;
    price: string;
    branchMenuItem: {
      id: string;
      name: string;
      description: string;
      image: string | null;
      isAvailable: boolean;
    };
  }>;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}
