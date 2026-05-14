import { Card, CardBody, Skeleton } from "@heroui/react";
import { cn, NumberFormatter } from "@repo/utils";
import { LuTriangleAlert } from "react-icons/lu";
import { MdOutlineInventory2 } from "react-icons/md";
import { TbCircleCheck, TbCircleOff } from "react-icons/tb";
import { useInventoryMetaCount } from "../hooks/useWarehouse";

interface StatsGridProps {
  warehouseId: string | undefined;
  isLoading?: boolean;
}

const StatsGrid = ({ warehouseId, isLoading }: StatsGridProps) => {
  const { data: total = 0, isLoading: l1 } = useInventoryMetaCount(
    warehouseId,
    undefined,
  );
  const { data: low = 0, isLoading: l2 } = useInventoryMetaCount(
    warehouseId,
    "LOW_STOCK",
  );
  const { data: out = 0, isLoading: l3 } = useInventoryMetaCount(
    warehouseId,
    "OUT_OF_STOCK",
  );
  const { data: inStock = 0, isLoading: l4 } = useInventoryMetaCount(
    warehouseId,
    "IN_STOCK",
  );

  const loading = isLoading || l1 || l2 || l3 || l4;

  const statuses = [
    {
      title: "Inventory lines",
      value: total,
      colorClass: "text-primary bg-primary/10",
      icon: MdOutlineInventory2,
      subtitle: loading ? "…" : "All tracked ingredients",
    },
    {
      title: "Low stock",
      value: low,
      colorClass: "text-warning bg-warning/10",
      icon: LuTriangleAlert,
      subtitle: "At or below minimum",
    },
    {
      title: "Out of stock",
      value: out,
      colorClass: "text-danger bg-danger/10",
      icon: TbCircleOff,
      subtitle: "Needs restock",
    },
    {
      title: "In stock",
      value: inStock,
      colorClass: "text-success bg-success/10",
      icon: TbCircleCheck,
      subtitle: "Above minimum",
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
            className="border-none bg-content1"
            classNames={{
              body: "p-5",
            }}
          >
            <CardBody className="flex flex-row justify-between ">
              <div className="flex flex-col gap-1 w-full">
                <p className="font-medium text-default-500">{status.title}</p>
                {loading ? (
                  <Skeleton className="h-8 w-16 rounded-lg my-1" />
                ) : (
                  <p className="font-bold text-2xl">
                    {typeof status.value === "number"
                      ? NumberFormatter.getNumberOnly(status.value, {
                          isCompact: true,
                        })
                      : status.value}
                  </p>
                )}

                {loading ? (
                  <Skeleton className="h-4 w-32 rounded-lg" />
                ) : (
                  <p className="text-default-400 text-sm">{status.subtitle}</p>
                )}
              </div>

              {loading ? (
                <Skeleton className="h-12 w-12 rounded-xl" />
              ) : (
                <div className={cn("p-3 rounded-xl h-fit", status.colorClass)}>
                  <Icon size={24} />
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;
