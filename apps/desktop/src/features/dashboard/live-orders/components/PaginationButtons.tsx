import { useOrderStore } from "@/store/OrderStore";
import { Pagination } from "@heroui/react";
import { useOrders } from "../hooks/useLiveOrders";

const PaginationButtons = () => {
  const { filters, setFilters } = useOrderStore();
  const { data } = useOrders(filters);

  const totalItems = data?.meta.total ?? 0;
  const pageSize = data?.meta.limit ?? filters.limit ?? 10;
  const total =
    data?.meta.lastPage ?? Math.max(1, Math.ceil(totalItems / pageSize));
  const page = data?.meta.currentPage || 1;

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
  };

  return (
    <div className="flex justify-center w-full py-4">
      <Pagination
        disableCursorAnimation
        showControls
        className="gap-2 cursor-pointer"
        classNames={{
          next: "!text-black bg-default-200 hover:bg-default-300 ",
          prev: "!text-black",
        }}
        total={total}
        page={page}
        onChange={handlePageChange}
        variant="light"
      />
    </div>
  );
};

export default PaginationButtons;
