import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

export type OrderMode = "pickup" | "dine-in";

export interface CartLineItem {
  itemId: string;
  name: string;
  branchId: string;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  unitPrice: number;
  variationId?: string;
  variationLabel?: string;
  image?: string | null;
}

export interface PlacedOrder {
  id: string;
  tableNumber: string;
  branchName: string;
  total: number;
  placedAt: Date;
  paymentMethod: string;
}

interface CartContextType {
  branchId: string | null;
  restaurantId: string | null;
  restaurantName: string | null;
  branchName: string | null;
  orderMode: OrderMode | null;
  tableNumber: string | null;
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  lastOrder: PlacedOrder | null;
  setBranchContext: (context: {
    branchId: string;
    restaurantId: string;
    restaurantName: string;
    branchName: string;
  }) => void;
  setDineInSession: (context: {
    branchId: string;
    restaurantId: string;
    restaurantName: string;
    branchName: string;
    tableNumber: string;
  }) => void;
  addItem: (item: CartLineItem) => void;
  updateItemQuantity: (
    itemId: string,
    quantity: number,
    variationId?: string,
  ) => void;
  removeItem: (itemId: string, variationId?: string) => void;
  placeOrder: (paymentMethod: string) => PlacedOrder;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const SERVICE_FEE_RATE = 0.1;

function generateOrderId() {
  return `AKL-${Math.floor(10000 + Math.random() * 90000)}`;
}

export function CartProvider({ children }: PropsWithChildren) {
  const [branchId, setBranchId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string | null>(null);
  const [orderMode, setOrderMode] = useState<OrderMode | null>(null);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);

  const setBranchContext = (context: {
    branchId: string;
    restaurantId: string;
    restaurantName: string;
    branchName: string;
  }) => {
    if (branchId && branchId !== context.branchId) {
      setItems([]);
    }
    setBranchId(context.branchId);
    setRestaurantId(context.restaurantId);
    setRestaurantName(context.restaurantName);
    setBranchName(context.branchName);
    setOrderMode("pickup");
    setTableNumber(null);
  };

  const setDineInSession = (context: {
    branchId: string;
    restaurantId: string;
    restaurantName: string;
    branchName: string;
    tableNumber: string;
  }) => {
    if (branchId && branchId !== context.branchId) {
      setItems([]);
    }
    setBranchId(context.branchId);
    setRestaurantId(context.restaurantId);
    setRestaurantName(context.restaurantName);
    setBranchName(context.branchName);
    setOrderMode("dine-in");
    setTableNumber(context.tableNumber);
  };

  const addItem = (item: CartLineItem) => {
    if (branchId && branchId !== item.branchId) {
      setItems([item]);
      setBranchId(item.branchId);
      setRestaurantId(item.restaurantId);
      setRestaurantName(item.restaurantName);
      return;
    }

    setBranchId(item.branchId);
    setRestaurantId(item.restaurantId);
    setRestaurantName(item.restaurantName);

    setItems((current) => {
      const existingIndex = current.findIndex(
        (line) =>
          line.itemId === item.itemId && line.variationId === item.variationId,
      );

      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + item.quantity,
        };
        return next;
      }

      return [...current, item];
    });
  };

  const updateItemQuantity = (
    itemId: string,
    quantity: number,
    variationId?: string,
  ) => {
    setItems((current) =>
      current
        .map((line) =>
          line.itemId === itemId && line.variationId === variationId
            ? { ...line, quantity }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const removeItem = (itemId: string, variationId?: string) => {
    setItems((current) =>
      current.filter(
        (line) =>
          !(line.itemId === itemId && line.variationId === variationId),
      ),
    );
  };

  const placeOrder = (paymentMethod: string) => {
    const order: PlacedOrder = {
      id: generateOrderId(),
      tableNumber: tableNumber ?? "—",
      branchName: branchName ?? "Branch",
      total,
      placedAt: new Date(),
      paymentMethod,
    };
    setLastOrder(order);
    setItems([]);
    return order;
  };

  const clearCart = () => {
    setItems([]);
    setBranchId(null);
    setRestaurantId(null);
    setRestaurantName(null);
    setBranchName(null);
    setOrderMode(null);
    setTableNumber(null);
  };

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );

  const serviceFee = useMemo(
    () => (orderMode === "dine-in" ? subtotal * SERVICE_FEE_RATE : 0),
    [subtotal, orderMode],
  );

  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

  return (
    <CartContext.Provider
      value={{
        branchId,
        restaurantId,
        restaurantName,
        branchName,
        orderMode,
        tableNumber,
        items,
        itemCount,
        subtotal,
        serviceFee,
        total,
        lastOrder,
        setBranchContext,
        setDineInSession,
        addItem,
        updateItemQuantity,
        removeItem,
        placeOrder,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
