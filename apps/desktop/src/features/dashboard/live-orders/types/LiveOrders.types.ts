export interface CreateOrderBody {
  CustomerName: string;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
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
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  source?: "APP" | "STORE";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export interface Order {
  id: string;
  totalPrice: string;
  branchId: string;
  userId: string;
  CustomerName: string;
  source: "APP" | "STORE";
  itemCount: number;
  status: string;
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
