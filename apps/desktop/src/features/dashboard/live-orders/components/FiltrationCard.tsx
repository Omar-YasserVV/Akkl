import { useState } from "react";
import { Card, Button } from "@heroui/react";

const basePillClasses =
  "min-w-[72px] h-9 px-4 rounded-sm text-xs font-medium transition-colors shadow-none";

type StatusFilter =
  | "all"
  | "pending"
  | "confirmed"
  | "cooking"
  | "ready"
  | "completed";

const FiltrationCard = () => {
  const [source, setSource] = useState<"all" | "App" | "Restaurant">("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  return (
    <Card className="w-full text-md font-normal rounded-lg bg-white shadow-sm px-6 py-3 flex flex-row items-center justify-between gap-8 border-0">
      {/* Source Section */}
      <div className="flex items-center gap-3">
        <span className="text-sm">Source:</span>

        <div className="flex items-center gap-2">
          {["all", "App", "Restaurant"].map((key) => (
            <Button
              key={key}
              radius="sm"
              size="sm"
              className={`${basePillClasses} ${
                source === key ? "bg-primary text-white" : "bg-white text-black"
              }`}
              onPress={() => setSource(key as typeof source)}
            >
              {key === "App"
                ? "App Orders"
                : key.charAt(0).toUpperCase() + key.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Status Section */}
      <div className="flex items-center gap-3">
        <span className="text-sm">Status:</span>

        <div className="flex items-center gap-2 flex-wrap">
          {(
            [
              "all",
              "pending",
              "confirmed",
              "cooking",
              "ready",
              "completed",
            ] as StatusFilter[]
          ).map((key) => (
            <Button
              key={key}
              radius="sm"
              size="sm"
              className={`${basePillClasses} ${
                status === key ? "bg-primary text-white" : "bg-white text-black"
              }`}
              onPress={() => setStatus(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FiltrationCard;
