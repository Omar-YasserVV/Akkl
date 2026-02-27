import { Button, cn } from "@heroui/react";
import { FaDollarSign } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { LuShoppingCart, LuWarehouse } from "react-icons/lu";

const ChartSelector = () => {
  const charts = [
    {
      title: "Total Revenue",
      value: "$123,456",
      description: "-12% from last month",
      icon: FaDollarSign,
    },
    {
      title: "Total Orders",
      value: "123",
      description: "+12% from last month",
      icon: LuShoppingCart,
    },
    {
      title: "Inventory Items",
      value: "123",
      description: "-12% from last month",
      icon: LuWarehouse,
    },
    {
      title: "Active Users",
      value: "123",
      description: "+12% from last month",
      icon: FiUsers,
    },
  ];
  return (
    <div className="grid grid-cols-4 gap-4">
      {charts.map((chart, i) => {
        return (
          <Button
            key={i}
            className="bg-white border border-default-200 p-6 flex-col gap-1 items-start  h-auto"
          >
            <div className="flex justify-between items-center w-full">
              <div className="space-y-1 text-start">
                <p className="text-default-400">{chart.title}</p>
                <p className="text-2xl font-bold">{chart.value}</p>
              </div>
              <div className="p-2.5 rounded-[10px] bg-primary-100 text-primary">
                <chart.icon size={24} />
              </div>
            </div>
            <p
              className={cn(
                "text-xs font-semibold",
                chart.description.includes("-")
                  ? "text-red-500"
                  : "text-green-500",
              )}
            >
              {chart.description}
            </p>
          </Button>
        );
      })}
    </div>
  );
};

export default ChartSelector;
