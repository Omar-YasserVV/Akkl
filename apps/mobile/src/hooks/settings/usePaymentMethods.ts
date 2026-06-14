import { PAYMENT_METHOD_LABELS } from "@/types/payment";
import { buildCardLabel, usePaymentStore } from "@/stores/payment-store";
import { CardFormValues, PaymentMethodType } from "@/types/payment";
import { useCallback } from "react";

export function usePaymentMethods() {
  const methods = usePaymentStore((state) => state.methods);
  const addMethod = usePaymentStore((state) => state.addMethod);
  const removeMethod = usePaymentStore((state) => state.removeMethod);
  const setDefaultMethod = usePaymentStore((state) => state.setDefaultMethod);

  const connectWallet = useCallback(
    (type: PaymentMethodType) => {
      const exists = methods.some((method) => method.type === type);
      if (exists) return;

      addMethod({
        type,
        label: PAYMENT_METHOD_LABELS[type],
        isDefault: methods.length === 0,
      });
    },
    [addMethod, methods],
  );

  const addCard = useCallback(
    (values: CardFormValues) => {
      const digits = values.cardNumber.replace(/\s/g, "");
      const lastFour = digits.slice(-4);
      const cardType: PaymentMethodType = digits.startsWith("4")
        ? "visa"
        : "mastercard";

      addMethod({
        type: cardType,
        label: buildCardLabel(cardType, lastFour),
        lastFour,
        isDefault: values.saveForFuture && methods.every((m) => !m.isDefault),
      });
    },
    [addMethod, methods],
  );

  return {
    methods,
    connectWallet,
    addCard,
    removeMethod,
    setDefaultMethod,
  };
}
