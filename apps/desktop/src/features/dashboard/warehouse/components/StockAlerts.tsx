import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@heroui/react";
import StockAlertCard from "./StockAlertCard";
import { IoArrowForward } from "react-icons/io5";

const StockAlerts = () => {
  const alerts = [
    {
      name: "Avocados (Hass)",
      currentStock: 4,
      minRequired: 10,
      status: "critical" as const,
    },
    {
      name: "Bananas",
      currentStock: 6,
      minRequired: 15,
      status: "low" as const,
    },
    {
      name: "Avocados (Hass)",
      currentStock: 4,
      minRequired: 10,
      status: "critical" as const,
    },
    {
      name: "Bananas",
      currentStock: 6,
      minRequired: 15,
      status: "low" as const,
    },
    {
      name: "Avocados (Hass)",
      currentStock: 4,
      minRequired: 10,
      status: "critical" as const,
    },
    {
      name: "Bananas",
      currentStock: 6,
      minRequired: 15,
      status: "low" as const,
    },
    {
      name: "Avocados (Hass)",
      currentStock: 4,
      minRequired: 10,
      status: "critical" as const,
    },
    {
      name: "Bananas",
      currentStock: 6,
      minRequired: 15,
      status: "low" as const,
    },
    {
      name: "Avocados (Hass)",
      currentStock: 4,
      minRequired: 10,
      status: "critical" as const,
    },
    {
      name: "Bananas",
      currentStock: 6,
      minRequired: 15,
      status: "low" as const,
    },
  ];
  return (
    <Card
      className=" h-full"
      classNames={{ header: "p-5 pb-2", body: "p-5 pt-2 " }}
    >
      <CardHeader className="justify-between">
        <p className="font-bold">Low Stock Alerts</p>
        <Chip radius="full" className="bg-red-500 text-white">
          2
        </Chip>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 overflow-y-auto  flex-1">
        {alerts.map((alert) => (
          <StockAlertCard
            key={alert.name}
            name={alert.name}
            currentStock={alert.currentStock}
            minRequired={alert.minRequired}
            status={alert.status}
          />
        ))}
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
