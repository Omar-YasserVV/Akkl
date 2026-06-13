import type { DiscoveryMenuItem, DiscoveryMenuVariation } from "@repo/utils";

export function getValidVariations(
  item: Pick<DiscoveryMenuItem, "variations">,
): DiscoveryMenuVariation[] {
  return (item.variations ?? []).filter(
    (variation) => Boolean(variation?.id && variation?.size),
  );
}

export function hasVariations(
  item: Pick<DiscoveryMenuItem, "variations">,
): boolean {
  return getValidVariations(item).length > 0;
}

export function getDisplayPrice(
  item: Pick<DiscoveryMenuItem, "price" | "discountPrice" | "variations">,
): number {
  const variations = getValidVariations(item);

  if (variations.length > 0) {
    return Math.min(
      ...variations.map(
        (variation) => variation.discountPrice ?? variation.price,
      ),
    );
  }

  return item.discountPrice ?? item.price;
}

export function formatMenuItemPrice(
  item: Pick<DiscoveryMenuItem, "price" | "discountPrice" | "variations">,
  formatPrice: (price: number) => string,
): string {
  const price = getDisplayPrice(item);
  return hasVariations(item) ? `From ${formatPrice(price)}` : formatPrice(price);
}
