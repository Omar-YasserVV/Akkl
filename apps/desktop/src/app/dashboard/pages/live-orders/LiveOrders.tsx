
import OrderList from "./components/OrderList";
import LiveOrdersHeader from './components/LiveOrdersHeader';
import StatsCard from "./components/StatsCard";
import FiltrationCard from "./components/FiltrationCard";
const LiveOrders = () => {
    // Calculate order counts by status

    return (
        <div className="px-4 py-6 flex flex-col gap-6 bg-[#F1F1F1] rounded-lg">
            <LiveOrdersHeader />
            <StatsCard />
            <FiltrationCard />
            <OrderList />
        </div>
    )
}

export default LiveOrders