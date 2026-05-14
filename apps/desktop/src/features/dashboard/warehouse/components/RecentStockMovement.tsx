import { Card, CardBody, CardHeader, Divider, Spinner } from "@heroui/react";
import { NumberFormatter } from "@repo/utils";
import { FiPlusCircle, FiMinusCircle, FiRefreshCw, FiEdit } from "react-icons/fi";
import { useInventoryLogs } from "../hooks/useWarehouse";

interface RecentStockMovementProps {
  warehouseId: string;
}

const RecentStockMovement = ({ warehouseId }: RecentStockMovementProps) => {
  const { data, isLoading } = useInventoryLogs({
    warehouseId,
    page: 1,
    limit: 15,
  });

  const movements = data?.data ?? [];

  const getActionIcon = (action: string) => {
    switch (action) {
      case "RESTOCK":
        return <FiPlusCircle />;
      case "CONSUME":
        return <FiMinusCircle />;
      case "CREATE":
        return <FiPlusCircle />;
      case "UPDATE":
        return <FiEdit />;
      default:
        return <FiRefreshCw />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "RESTOCK":
        return "bg-green-600/10 text-green-600";
      case "CONSUME":
        return "bg-red-600/10 text-red-600";
      case "CREATE":
        return "bg-blue-600/10 text-blue-600";
      case "UPDATE":
        return "bg-orange-600/10 text-orange-600";
      default:
        return "bg-default-600/10 text-default-600";
    }
  };

  return (
    <Card
      classNames={{
        header: "p-5",
        body: "p-5",
      }}
      className="col-span-3 row-span-2"
    >
      <CardHeader>
        <p className="font-bold">Recent Stock Movements</p>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-4 overflow-y-auto max-h-[320px]">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner size="sm" />
          </div>
        ) : movements.length === 0 ? (
          <p className="text-sm text-default-500">
            No recent stock movements.
          </p>
        ) : (
          movements.map((log) => (
            <div key={log.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-1.5 rounded-full ${getActionColor(log.action)}`}>
                  {getActionIcon(log.action)}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {log.action.charAt(0) + log.action.slice(1).toLowerCase()}: {log.inventoryItem?.ingredient.name}
                  </p>
                  <p className="text-xs text-default-500">
                    {new Date(log.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-sm font-semibold ${log.quantityChange > 0 ? "text-green-600" : log.quantityChange < 0 ? "text-red-600" : "text-default-600"}`}>
                  {log.quantityChange > 0 ? "+" : ""}
                  {NumberFormatter.getNumberOnly(Number(log.quantityChange), {
                    unit: log.inventoryItem?.ingredient.unit,
                  })}
                </p>
                <p className="text-[10px] text-default-400">
                  New: {log.newQuantity} {log.inventoryItem?.ingredient.unit}
                </p>
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
};

export default RecentStockMovement;
