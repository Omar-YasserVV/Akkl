// types/PaginatedResponse.ts
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

// types/Order.ts
export type OrderSource = "APP" | "STORE";
export type OrderStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type MenuCategory =
  | "MAIN_COURSE"
  | "APPETIZER"
  | "SIDE_DISH"
  | "BEVERAGE";

export interface Branch {
  id: string;
  name: string;
  branchNumber: string;
}

export interface BranchMenuItem {
  id: string;
  branchId: string;
  menuItemId: string;
  category: MenuCategory;
  price: string;
  discountPrice: string | null;
  preparationTime: number;
  isAvailable: boolean;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  variationId: string | null;
  specialInstructions: string | null;
  quantity: number;
  price: string;
  totalPrice: string;
  branchMenuItem: BranchMenuItem;
}

export interface Order {
  id: string;
  orderNumber: number;
  totalPrice: string;
  branchId: string;
  userId: string;
  customerName: string;
  source: OrderSource;
  itemCount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  branch: Branch;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  source?: OrderSource;
}

export type GetOrdersData = OrderFilters;
