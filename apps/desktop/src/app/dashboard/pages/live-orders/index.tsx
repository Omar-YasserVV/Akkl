import OrderList from "./components/OrderList";
import LiveOrdersHeader from "./components/LiveOrdersHeader";
import StatsCard from "./components/StatsCard";
import FiltrationCard from "./components/FiltrationCard";
const LiveOrders = () => {
  // Calculate order counts by status

  return (
    <div className="space-y-4.5">
      <LiveOrdersHeader />
      <StatsCard />
      <FiltrationCard />
      <OrderList />
    </div>
  );
};

export default LiveOrders;
