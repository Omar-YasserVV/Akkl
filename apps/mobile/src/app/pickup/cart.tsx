import { CartReviewScreen } from "@/components/cart/CartReviewScreen";
import { useCart } from "@/context/cart-context";
import { type Href, useRouter } from "expo-router";
import React from "react";

const formatPrice = (price: number) => `${price.toFixed(2)} LE`;

export default function PickupCartScreen() {
  const router = useRouter();
  const {
    items,
    subtotal,
    updateItemQuantity,
    removeItem,
    branchName,
  } = useCart();

  const serviceFee = 2.5;
  const tax = subtotal * 0.08;
  const totalWithTax = subtotal > 0 ? subtotal + serviceFee + tax : 0;

  return (
    <CartReviewScreen
      title="Your Cart"
      branchName={branchName || "Downtown Branch"}
      items={items}
      summaryRows={[
        { label: "Subtotal", value: formatPrice(subtotal) },
        { label: "Service Fee", value: formatPrice(serviceFee) },
        { label: "Tax (8%)", value: formatPrice(tax) },
      ]}
      total={formatPrice(totalWithTax)}
      ctaLabel="Go to Checkout"
      onBack={() => router.back()}
      onEmptyAction={() => router.back()}
      onSubmit={() => router.push("/pickup/checkout" as Href)}
      onQuantityChange={updateItemQuantity}
      onRemove={removeItem}
    />
  );
}
