/**
 * Universal Number Formatter
 * @param value - The number to format
 * @param options - Configuration for currency and abbreviation
 */
export const formatNumber = (
  value: number,
  options: {
    isCurrency?: boolean;
    isCompact?: boolean;
    decimals?: number;
  } = {},
) => {
  const { isCurrency = false, isCompact = false, decimals = 0 } = options;

  return new Intl.NumberFormat("en-US", {
    ...(isCurrency && { style: "currency", currency: "USD" }),
    notation: isCompact ? "compact" : "standard",
    compactDisplay: "short",
    minimumFractionDigits: 0,
    maximumFractionDigits: isCompact ? 1 : decimals,
  }).format(value);
};
