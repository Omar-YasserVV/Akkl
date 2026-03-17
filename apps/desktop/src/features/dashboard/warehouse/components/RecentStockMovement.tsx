import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { formatNumber } from "@repo/utils";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

const mockStockMovements = [
  {
    id: 1,
    product: "Atlantic Salmon",
    date: "Oct 24, 09:15 AM",
    supplier: "Ocean Delights",
    quantity: "1000",
    unit: "kg",
    increase: true,
  },
  {
    id: 2,
    product: "Chicken Breast",
    date: "Oct 24, 11:40 AM",
    supplier: "Kitchen Usage",
    quantity: "250",
    unit: "kg",
    increase: false,
  },
  {
    id: 3,
    product: "Olive Oil",
    date: "Oct 23, 04:20 PM",
    supplier: "Mediterranean Supplies",
    quantity: "120",
    unit: "L",
    increase: true,
  },
  {
    id: 4,
    product: "Mozzarella Cheese",
    date: "Oct 23, 01:10 PM",
    supplier: "Pizza Station",
    quantity: "80",
    unit: "kg",
    increase: false,
  },
];

const RecentStockMovement = () => {
  return (
    <Card
      classNames={{
        header: "p-5",
        body: "p-5",
      }}
      className="col-span-3"
    >
      <CardHeader>
        <p className="font-bold">Recent Stock Movement</p>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-4">
        {mockStockMovements.map((item) => {
          return (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-1.5 rounded-full ${
                    item.increase
                      ? "bg-green-600/10 text-green-600"
                      : "bg-default-500/10 text-default-500"
                  }`}
                >
                  {item.increase ? <FiPlusCircle /> : <FiMinusCircle />}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {item.increase ? "Restock" : "Usage"}: {item.product}
                  </p>
                  <p className="text-xs text-default-500">
                    {item.date} • {item.increase ? "Supplier" : "Used by"}:{" "}
                    {item.supplier}
                  </p>
                </div>
              </div>

              <p
                className={`text-sm font-semibold ${
                  item.increase ? "text-green-600" : "text-default-500"
                }`}
              >
                {item.increase ? "+" : "-"}:
                {formatNumber(Number(item.quantity.replace(/[^\d.-]/g, "")), {
                  weightUnit: item.unit,
                })}
              </p>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};

export default RecentStockMovement;
