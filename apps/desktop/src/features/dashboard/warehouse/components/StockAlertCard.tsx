import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

interface StockAlertProps {
  name: string;
  currentStock: number;
  minRequired: number;
  status: "low" | "critical";
}

const StockAlertCard = ({
  name,
  currentStock,
  minRequired,
  status,
}: StockAlertProps) => {
  const isCritical = status === "critical";

  const styles = {
    card: isCritical
      ? "bg-red-100/90 border-red-200 text-red-950"
      : "bg-yellow-100/90 border-yellow-200 text-yellow-950",
    button: isCritical ? "bg-red-600 text-white" : "bg-amber-600 text-white",
  };

  return (
    <Card
      className={`${styles.card} border shrink-0`}
      shadow="sm"
      classNames={{
        body: "py-0",
        base: "p-1",
      }}
    >
      <CardHeader className="justify-between pb-1">
        <p className="text-sm font-bold">{name}</p>
        <p className="font-bold text-xs uppercase tracking-wider">{status}</p>
      </CardHeader>

      <CardBody className="text-xs">
        <p>
          Current stock:{" "}
          <span className="font-semibold">{currentStock} units.</span>
        </p>
        <p>
          Minimum Required:{" "}
          <span className="font-semibold">{minRequired} units.</span>
        </p>
      </CardBody>

      <CardFooter className="pt-3">
        <Button
          className={`w-full ${styles.button} font-medium h-8`}
          radius="sm"
          size="sm"
        >
          Quick Record
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StockAlertCard;
