import { Card, Progress } from "@heroui/react";
import { IoArrowDownCircle, IoArrowUpCircle } from "react-icons/io5";

const TopItems = () => {
  const items = [
    { name: "Classic Cheeseburger", percent: 12, upordown: "up" },
    { name: "Spicy Jalapeño Burger", percent: 5, upordown: "down" },
    { name: "Truffle Mushroom Swiss", percent: 28, upordown: "up" },
    { name: "BBQ Bacon King", percent: 2, upordown: "up" },
    { name: "Beyond Plant-Based", percent: 15, upordown: "down" },
  ];

  return (
    <Card
      className="border border-default-200 h-[423px] col-span-1 p-6"
      shadow="none"
    >
      <div className="flex flex-col items-start mb-6 space-y-1">
        <h2 className="text-2xl font-semibold">Top Selling Items</h2>
        <p className="text-small text-default-500">This Week</p>
      </div>

      <div className="flex flex-col gap-6">
        {items.map((item, i) => (
          <div key={item.name} className="flex items-end gap-4">
            {/* Rank Number */}
            <span className="text-default-400 font-medium w-4">{i + 1}</span>

            {/* Progress Section */}
            <div className="flex-1">
              <Progress
                label={item.name}
                value={item.percent}
                radius="sm"
                classNames={{
                  label: "text-small font-medium text-default-700",
                  base: "max-w-md",
                }}
              />
            </div>

            {/* Stats Section */}
            <div className="flex items-center gap-2 min-w-[60px] justify-end">
              <span className="text-small font-semibold">{item.percent}%</span>
              {item.upordown === "up" ? (
                <IoArrowUpCircle size={20} className="text-success" />
              ) : (
                <IoArrowDownCircle size={20} className="text-danger" />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopItems;
