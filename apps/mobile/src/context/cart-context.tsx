import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

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

interface CartContextType {
  branchId: string | null;
  restaurantId: string | null;
  restaurantName: string | null;
  branchName: string | null;
  items: CartLineItem[];
  itemCount: number;
  total: number;
  setBranchContext: (context: {
    branchId: string;
    restaurantId: string;
    restaurantName: string;
    branchName: string;
  }) => void;
  addItem: (item: CartLineItem) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: PropsWithChildren) {
  const [branchId, setBranchId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string | null>(null);
  const [items, setItems] = useState<CartLineItem[]>([]);

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

  const clearCart = () => {
    setItems([]);
    setBranchId(null);
    setRestaurantId(null);
    setRestaurantName(null);
    setBranchName(null);
  };

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        branchId,
        restaurantId,
        restaurantName,
        branchName,
        items,
        itemCount,
        total,
        setBranchContext,
        addItem,
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
