import { Spinner } from "@heroui/react";

type DashboardTableLoadingOverlayProps = {
  className?: string;
  label?: string;
};

export const DEFAULT_DASHBOARD_TABLE_LOADING_ROWS = 6;
export const DASHBOARD_TABLE_SKELETON_CELL_CLASSNAME = "h-5 w-full rounded-md";

export function createDashboardTableLoadingRows(rowCount = DEFAULT_DASHBOARD_TABLE_LOADING_ROWS) {
  return Array.from({ length: rowCount }, (_, rowIndex) => ({
    id: `loading-row-${rowIndex}`,
  }));
}

export function DashboardTableLoadingOverlay({
  className = "absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] z-10",
  label = "Loading...",
}: DashboardTableLoadingOverlayProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-xs text-gray-400 font-medium">{label}</span>
      </div>
    </div>
  );
}
