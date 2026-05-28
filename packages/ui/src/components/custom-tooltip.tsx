import { NumberFormatter } from "@repo/utils";

type CustomTooltipProps = {
  active?: boolean;
  payload?: { value: number | string }[];
  label?: string;
  isCurrency?: boolean;
};

export const CustomTooltip = ({
  active,
  payload,
  label,
  isCurrency,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const value = payload?.[0]?.value;
  const formatted =
    typeof value === "number"
      ? NumberFormatter.getNumberOnly(value, { isCurrency, isCompact: false })
      : value;

  let formattedLabel = null;
  if (label) {
    const date = new Date(label);
    formattedLabel = `${date.toLocaleString("default", { month: "short" })} ${date.getDate().toString()}`;
  }

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="bg-[#1a73e8] text-white p-4 rounded-2xl shadow-lg min-w-[140px] text-center">
        {formattedLabel && (
          <p className="text-xs font-medium opacity-90 mb-1">
            {formattedLabel}
          </p>
        )}
        <p className="text-3xl font-bold">{formatted}</p>
      </div>
    </div>
  );
};
