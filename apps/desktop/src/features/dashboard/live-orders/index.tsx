import FiltrationCard from "./components/FiltrationCard";
import LiveOrdersHeader from "./components/LiveOrdersHeader";
import OrderList from "./components/OrderList";
import PaginationButtons from "./components/PaginationButtons";
import StatsCards from "./components/StatsCards";
const LiveOrders = () => {
  // Calculate order counts by status

  return (
    <>
      <LiveOrdersHeader />
      <StatsCards />
      <FiltrationCard />
      <OrderList />
      <PaginationButtons />
    </>
  );
};

export default LiveOrders;
