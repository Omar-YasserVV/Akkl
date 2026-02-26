import { ChefHat, CircleCheck, Clock8 } from 'lucide-react';
import { Card } from "@heroui/react";
import { DUMMY_ORDERS } from '../constants/constants';

const pendingCount = DUMMY_ORDERS.filter(order => order.status === "pending").length;
const cookingCount = DUMMY_ORDERS.filter(order => order.status === "cooking").length;
const readyCount = DUMMY_ORDERS.filter(order => order.status === "ready").length;


const StatsCard = () => {
    return (
        <div className="flex gap-4 items-center">
            <Card className="flex flex-row items-center justify-between border-2 rounded-lg p-4 bg-white border-amber-400 w-full">
                <div className="flex flex-col gap-2 items-start">
                    <p className="text-gray-500 text-sm font-normal">Pending</p>
                    <p className="text-2xl font-bold text-black">{pendingCount}</p>
                </div>
                <div className="bg-amber-100 rounded-md p-3 flex items-center justify-center">
                    <Clock8 className="w-6 h-6 text-[#746A0C]" />
                </div>
            </Card>
            <Card className="flex flex-row items-center justify-between border-2 rounded-lg p-4 bg-white border-orange-500 w-full">
                <div className="flex flex-col gap-2 items-start">
                    <p className="text-gray-500 text-sm font-normal">Cooking</p>
                    <p className="text-2xl font-bold text-black">{cookingCount}</p>
                </div>
                <div className="bg-orange-100 rounded-md p-3 flex items-center justify-center">
                    <ChefHat className="w-6 h-6 text-rose-900" />
                </div>
            </Card>
            <Card className="flex flex-row items-center justify-between border-2 rounded-lg p-4 bg-white border-green-500 w-full">
                <div className="flex flex-col gap-2 items-start">
                    <p className="text-gray-500 text-sm font-normal">Ready</p>
                    <p className="text-2xl font-bold text-black">{readyCount}</p>
                </div>
                <div className="bg-green-100 rounded-md p-3 flex items-center justify-center">
                    <CircleCheck className="w-6 h-6 text-green-800" />
                </div>
            </Card>
        </div>
    )
}

export default StatsCard