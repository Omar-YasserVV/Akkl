import { Card } from "@heroui/react";
import { useLiveOrdersStore } from "@/store/liveOrdersFilterStore";
import { LuChefHat, LuClock8, LuCircleCheck } from "react-icons/lu";

const StatsCard = () => {
  const orders = useLiveOrdersStore((state) => state.orders);

  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const cookingCount = orders.filter((order) => order.status === "cooking").length;
  const readyCount = orders.filter((order) => order.status === "ready").length;

  return (
    <div className="flex gap-4 items-center">
      <Card className="flex flex-row items-center justify-between border-2 rounded-lg p-4 bg-white border-amber-400 w-full">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-gray-500 text-sm font-normal">Pending</p>
          <p className="text-2xl font-bold text-black">{pendingCount}</p>
        </div>
        <div className="bg-amber-100 rounded-md p-3 flex items-center justify-center">
          <LuClock8 className="w-6 h-6 text-[#746A0C]" />
        </div>
      </Card>
      <Card className="flex flex-row items-center justify-between border-2 rounded-lg p-4 bg-white border-orange-500 w-full">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-gray-500 text-sm font-normal">Cooking</p>
          <p className="text-2xl font-bold text-black">{cookingCount}</p>
        </div>
        <div className="bg-orange-100 rounded-md p-3 flex items-center justify-center">
          <LuChefHat className="w-6 h-6 text-orange-900" />
        </div>
      </Card>
      <Card className="flex flex-row items-center justify-between border-2 rounded-lg p-4 bg-white border-green-500 w-full">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-gray-500 text-sm font-normal">Ready</p>
          <p className="text-2xl font-bold text-black">{readyCount}</p>
        </div>
        <div className="bg-green-100 rounded-md p-3 flex items-center justify-center">
          <LuCircleCheck className="w-6 h-6 text-green-800" />
        </div>
      </Card>
    </div>
  );
};

export default StatsCard;
