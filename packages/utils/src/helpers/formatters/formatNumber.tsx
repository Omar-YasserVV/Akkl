export const formatNumber = (
  value: number,
  options: {
    isCurrency?: boolean;
    isCompact?: boolean;
    decimals?: number;
    weightUnit?: string;
    unitStyle?: string;
  } = {},
) => {
  const {
    isCurrency = false,
    isCompact = false,
    decimals = 0,
    weightUnit = "kg",
    unitStyle = "",
  } = options;

  const formattedValue = new Intl.NumberFormat("en-US", {
    ...(isCurrency && { style: "currency", currency: "USD" }),
    notation: isCompact ? "compact" : "standard",
    compactDisplay: "short",
    minimumFractionDigits: 0,
    maximumFractionDigits: isCompact ? 1 : decimals,
  }).format(value);

  return (
    <span>
      {formattedValue} <span className={unitStyle || ""}>{weightUnit}</span>
    </span>
  );
};
