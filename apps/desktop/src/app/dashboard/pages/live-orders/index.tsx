import OrderList from "./components/OrderList";
import LiveOrdersHeader from "./components/LiveOrdersHeader";
import StatsCard from "./components/StatsCard";
import FiltrationCard from "./components/FiltrationCard";
const LiveOrders = () => {
  // Calculate order counts by status

  return (
    <>
      <LiveOrdersHeader />
      <StatsCard />
      <FiltrationCard />
      <OrderList />
    </>
  );
};

export default LiveOrders;
