import { PaymentMethod, PaymentMethodType, PAYMENT_METHOD_LABELS } from "@/types/payment";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PaymentStoreState {
  methods: PaymentMethod[];
  addMethod: (method: Omit<PaymentMethod, "id" | "addedAt">) => void;
  removeMethod: (id: string) => void;
  setDefaultMethod: (id: string) => void;
}

const DEFAULT_METHODS: PaymentMethod[] = [
  {
    id: "pm-apple",
    type: "apple_pay",
    label: PAYMENT_METHOD_LABELS.apple_pay,
    isDefault: true,
    addedAt: new Date().toISOString(),
  },
  {
    id: "pm-visa",
    type: "visa",
    label: "Visa card ending in 4242",
    lastFour: "4242",
    isDefault: false,
    addedAt: new Date().toISOString(),
  },
  {
    id: "pm-google",
    type: "google_pay",
    label: PAYMENT_METHOD_LABELS.google_pay,
    isDefault: false,
    addedAt: new Date().toISOString(),
  },
];

export const usePaymentStore = create<PaymentStoreState>()(
  persist(
    (set, get) => ({
      methods: DEFAULT_METHODS,
      addMethod: (method) => {
        const hasDefault = get().methods.some((item) => item.isDefault);
        const newMethod: PaymentMethod = {
          ...method,
          id: `pm-${Date.now()}`,
          addedAt: new Date().toISOString(),
          isDefault: method.isDefault || !hasDefault,
        };

        set((state) => ({
          methods: hasDefault && newMethod.isDefault
            ? [
                ...state.methods.map((item) => ({ ...item, isDefault: false })),
                newMethod,
              ]
            : [...state.methods, newMethod],
        }));
      },
      removeMethod: (id) =>
        set((state) => {
          const remaining = state.methods.filter((item) => item.id !== id);
          if (remaining.length === 0) return { methods: remaining };
          const hasDefault = remaining.some((item) => item.isDefault);
          if (!hasDefault) {
            remaining[0] = { ...remaining[0], isDefault: true };
          }
          return { methods: remaining };
        }),
      setDefaultMethod: (id) =>
        set((state) => ({
          methods: state.methods.map((item) => ({
            ...item,
            isDefault: item.id === id,
          })),
        })),
    }),
    {
      name: "akkl-payment-methods",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function buildCardLabel(type: PaymentMethodType, lastFour: string): string {
  const brand = PAYMENT_METHOD_LABELS[type];
  return `${brand} card ending in ${lastFour}`;
}
