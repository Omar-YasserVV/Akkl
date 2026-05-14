import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Skeleton,
} from "@heroui/react";
import { useMemo } from "react";
import { IoArrowForward } from "react-icons/io5";
import { useStockAlerts } from "../hooks/useWarehouse";
import type { InventoryItemDto } from "../types/inventory.types";
import StockAlertCard from "./StockAlertCard";

interface StockAlertsProps {
  warehouseId: string | undefined;
  isLoading?: boolean;
}

const StockAlerts = ({ warehouseId, isLoading }: StockAlertsProps) => {
  const { data, isLoading: queryLoading } = useStockAlerts(warehouseId);

  const alerts = useMemo(() => {
    return data?.items.slice(0, 12) ?? [];
  }, [data]);

  const alertCount = data?.items.length ?? 0;

  const loading = isLoading || queryLoading;

  return (
    <Card
      className="flex-1"
      classNames={{ header: "p-5 pb-2", body: "p-5 pt-2 " }}
    >
      <CardHeader className="justify-between">
        <p className="font-bold">Low Stock Alerts</p>
        <Chip radius="full" className="bg-red-500 text-white">
          {loading ? "…" : alertCount}
        </Chip>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 overflow-y-auto max-h-[400px]">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl shrink-0" />
            ))}
          </>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-default-500">
            No low or out-of-stock items.
          </p>
        ) : (
          alerts.map((row) => (
            <StockAlertCard
              key={row.id}
              name={row.ingredient.name}
              currentStock={row.quantity}
              minRequired={row.minimumQuantity}
              unit={row.ingredient.unit}
              status={row.stockStatus === "OUT_OF_STOCK" ? "critical" : "low"}
            />
          ))
        )}
      </CardBody>
      <CardFooter className="pt-3">
        <Button
          className="w-full"
          variant="light"
          endContent={<IoArrowForward />}
        >
          View All Alerts
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StockAlerts;
