import { useOrderStore } from "@/store/OrderStore";
import { Pagination, PaginationItemType } from "@heroui/react";
import { cn } from "@repo/utils";
import { useOrders } from "../hooks/useLiveOrders";

const ChevronIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M15.5 19l-7-7 7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

const PaginationButtons = () => {
  const { filters, setFilters } = useOrderStore();
  const { data } = useOrders(filters);

  const total = data?.meta.lastPage || 1;
  const page = data?.meta.currentPage || 1;

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
  };

  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }: any) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(
            className,
            "bg-neutral-100 min-w-8 w-8 h-8 rounded-sm hover:bg-neutral-200 transition-colors",
          )}
          onClick={onNext}
        >
          <ChevronIcon className="rotate-180" />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={cn(
            className,
            "bg-neutral-100 min-w-8 w-8 h-8 rounded-sm hover:bg-neutral-200 transition-colors",
          )}
          onClick={onPrevious}
        >
          <ChevronIcon />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={cn(className, "text-neutral-400")}>
          ...
        </button>
      );
    }

    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          className,
          "min-w-8 w-8 h-8 rounded-sm transition-all",
          isActive
            ? "bg-primary text-white font-semibold"
            : "bg-white text-neutral-600 hover:bg-neutral-50 border border-gray-100",
        )}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="flex justify-center w-full py-4">
      <Pagination
        disableCursorAnimation
        showControls
        className="gap-2"
        radius="none"
        renderItem={renderItem}
        total={total}
        page={page}
        onChange={handlePageChange}
        variant="light"
      />
    </div>
  );
};

export default PaginationButtons;
