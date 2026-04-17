import FiltrationCard from "./components/FiltrationCard";
import LiveOrdersHeader from "./components/LiveOrdersHeader";
import OrderList from "./components/OrderList";
import StatsCards from "./components/StatsCards";
const LiveOrders = () => {
  // Calculate order counts by status

  return (
    <>
      <LiveOrdersHeader />
      <StatsCards />
      <FiltrationCard />
      <OrderList />
    </>
  );
};

export default LiveOrders;
