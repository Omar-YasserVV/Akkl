import { Card } from "@heroui/react";
import ChartSelector from "./chart-selector";
import Chart from "./chart";

const ChartManager = () => {
  return (
    <Card
      className="border border-default-200 col-span-4 p-6 space-y-14"
      shadow="none"
    >
      <ChartSelector />
      <Chart />
    </Card>
  );
};

export default ChartManager;
