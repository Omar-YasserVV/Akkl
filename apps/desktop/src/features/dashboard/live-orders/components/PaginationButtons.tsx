import { useOrders } from "@/hooks/Orders/FetchOrders";
import { Pagination } from "@heroui/react";
import { useOrderStore } from "../store/OrderStore";
const PaginationButtons = () => {
  const { filters, setFilters } = useOrderStore();
  const { data } = useOrders(filters);

  const pages = data?.meta.pages || 1;
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
        total={pages}
        page={page}
        onChange={handlePageChange}
        variant="light"
      />
    </div>
  );
};

export default PaginationButtons;
