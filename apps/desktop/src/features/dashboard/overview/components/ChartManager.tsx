import { Card } from "@heroui/react";

import ChartSelector from "./ChartSelector";
import Chart from "./Chart";

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
