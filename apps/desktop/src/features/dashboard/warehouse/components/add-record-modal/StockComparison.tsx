import { IoArrowForward } from "react-icons/io5";
import { NumberFormatter } from "@repo/utils";

interface StockComparisonProps {
  currentStock: number;
  projectedStock: number;
  unit: string;
}

export const StockComparison = ({
  currentStock,
  projectedStock,
  unit,
}: StockComparisonProps) => (
  <div className="flex items-center justify-between bg-default-100 border border-default-200 rounded-[12px] p-4 col-span-2">
    <div>
      <p className="uppercase text-default-500 text-xs font-bold tracking-wide">
        Current Stock
      </p>
      <p className="text-xl font-bold">
        {NumberFormatter.getWithUnit(currentStock, {
          decimals: 2,
          Unit: unit,
          unitStyle: "text-default-500 text-sm font-medium",
        })}
      </p>
    </div>
    <IoArrowForward size={30} className="text-default-300" />
    <div>
      <p className="uppercase text-default-500 text-xs font-bold tracking-wide">
        Projected Stock
      </p>
      <p className="text-xl font-bold text-primary text-end">
        {NumberFormatter.getWithUnit(projectedStock, {
          decimals: 2,
          Unit: unit,
          unitStyle: "text-sm font-medium",
        })}
      </p>
    </div>
  </div>
);
