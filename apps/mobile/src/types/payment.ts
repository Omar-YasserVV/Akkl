export type PaymentMethodType =
  | "apple_pay"
  | "google_pay"
  | "visa"
  | "mastercard"
  | "vodafone_cash"
  | "cash_on_delivery";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  lastFour?: string;
  isDefault: boolean;
  addedAt: string;
}

export interface CardFormValues {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveForFuture: boolean;
}

export interface WalletOption {
  type: PaymentMethodType;
  label: string;
  description: string;
  icon: "logo-apple" | "logo-google" | "card-outline" | "phone-portrait-outline";
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  apple_pay: "Apple Pay",
  google_pay: "Google Pay",
  visa: "Visa",
  mastercard: "Mastercard",
  vodafone_cash: "Vodafone Cash",
  cash_on_delivery: "Cash on Delivery",
};
