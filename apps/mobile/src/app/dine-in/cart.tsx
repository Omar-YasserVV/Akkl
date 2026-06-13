import { CartReviewScreen } from "@/components/cart/CartReviewScreen";
import { DINE_IN_RECOMMENDATIONS, formatPrice } from "@/constants/dine-in";
import { useCart } from "@/context/cart-context";
import type { DiscoveryMenuItem } from "@repo/utils";
import { type Href, useRouter } from "expo-router";
import React from "react";

export default function DineInCartScreen() {
  const router = useRouter();
  const {
    items,
    subtotal,
    addItem,
    updateItemQuantity,
    removeItem,
    branchName,
    tableNumber,
  } = useCart();

  const handleAddRecommendation = (item: DiscoveryMenuItem) => {
    addItem({
      itemId: item.id,
      name: item.name,
      branchId: item.branchId,
      restaurantId: item.restaurantId ?? "",
      restaurantName: item.restaurantName ?? "",
      quantity: 1,
      unitPrice: item.discountPrice ?? item.price,
      image: item.image,
    });
  };

  return (
    <CartReviewScreen
      title="Cart Review"
      branchName={branchName ?? "Downtown Branch"}
      tableNumber={tableNumber ?? "5"}
      items={items}
      summaryRows={[
        { label: "Subtotal", value: formatPrice(subtotal) },
      ]}
      total={formatPrice(subtotal)}
      ctaLabel="Go to Payment"
      recommendations={DINE_IN_RECOMMENDATIONS.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.discountPrice ?? item.price,
        image: item.image,
        onAdd: () => handleAddRecommendation(item),
      }))}
      onBack={() => router.back()}
      onEmptyAction={() => router.back()}
      onSubmit={() => router.push("/dine-in/payment" as Href)}
      onQuantityChange={updateItemQuantity}
      onRemove={removeItem}
    />
  );
}
