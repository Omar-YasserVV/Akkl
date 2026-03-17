import { Card } from "@heroui/react";
import { cn, formatNumber } from "@repo/utils";
import { FaMoneyBills } from "react-icons/fa6";
import { LuTriangleAlert } from "react-icons/lu";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";

const StatsGrid = () => {
  const statuses = [
    {
      title: "Total Stock Value",
      value: 1234500,
      colorClass: "text-primary bg-primary/10",
      icon: FaMoneyBills,
      fromLastMonth: "12.5",
      increase: true,
    },
    {
      title: "Low Stock Items",
      value: 890,
      colorClass: "text-danger bg-danger/10",
      icon: LuTriangleAlert,
      fromLastMonth: "2.1",
      increase: false,
    },
    {
      title: "Pending Purchase Orders",
      value: 12,
      colorClass: "text-warning bg-warning/10",
      icon: MdOutlinePendingActions,
    },
    {
      title: "Inventory Turnover",
      value: "4.2x",
      colorClass: "text-indigo-700 bg-indigo-700/10",
      icon: FaExchangeAlt,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statuses.map((status) => {
        const Icon = status.icon;

        return (
          <Card
            key={status.title}
            shadow="sm"
            className="border-none bg-content1 p-5"
          >
            <div className="flex flex-row justify-between ">
              <div className="flex flex-col gap-1">
                <p className="font-medium text-default-500">{status.title}</p>
                <p className="font-bold text-2xl">
                  {typeof status.value === "number"
                    ? formatNumber(status.value, {
                        isCompact: true,
                      })
                    : status.value}
                </p>

                {status.fromLastMonth ? (
                  <p
                    className={cn(
                      "flex items-center font-medium",
                      status.increase ? "text-success" : "text-danger",
                    )}
                  >
                    <span>{status.increase ? "+" : "-"}</span>
                    <span className="ml-1">
                      {status.fromLastMonth}% from last month
                    </span>
                  </p>
                ) : (
                  <p className="text-default-400">Stable vs last month</p>
                )}
              </div>

              <div className={cn("p-3 rounded-xl h-fit", status.colorClass)}>
                <Icon size={24} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;
