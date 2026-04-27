import PaginationButtons from "@/features/dashboard/components/shared/PaginationButtons";
import { useOrders } from "@/hooks/Orders/FetchOrders";
import { useOrderStore } from "../store/OrderStore";

const OrdersPaginationButtons = () => {
  const { filters, setFilters } = useOrderStore();
  const { data } = useOrders(filters);

  const pages = data?.meta.pages || 1;
  const page = data?.meta.currentPage || 1;

  return (
    <PaginationButtons
      page={page}
      total={pages}
      onChange={(newPage) => setFilters({ page: newPage })}
    />
  );
};

export default OrdersPaginationButtons;
