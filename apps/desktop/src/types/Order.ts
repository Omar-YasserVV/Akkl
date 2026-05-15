import { OrderState, Source } from "@repo/types";

export interface OrderFilters {
  page: number;
  limit: number;
  status?: OrderState;
  source?: Source;
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
  orderNumber: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    orderId: string;
    menuItemId: string;
    quantity: number;
    specialInstructions: string | null;
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
