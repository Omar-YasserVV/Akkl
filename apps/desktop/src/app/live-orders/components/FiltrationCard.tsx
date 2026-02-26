import React from "react";
import { Card, Button } from "@heroui/react";

type SourceFilter = "all" | "app" | "restaurant";
type StatusFilter = "all" | "pending" | "confirmed" | "cooking" | "ready" | "completed";

const basePillClasses =
    "min-w-[72px] h-9 px-4 rounded-sm text-xs font-medium transition-colors shadow-none";

const FiltrationCard = () => {
    const [source, setSource] = React.useState<SourceFilter>("all");
    const [status, setStatus] = React.useState<StatusFilter>("all");

    return (
        <Card className="w-full text-md font-normal rounded-lg bg-white shadow-sm px-6 py-3 flex flex-row items-center justify-between gap-8 border-0">
            <div className="flex items-center gap-3">
                <span className="text-sm">Source:</span>
                <div className="flex items-center gap-2">
                    <Button
                        radius="sm"
                        size="sm"
                        className={` ${basePillClasses} ${source === "all" ? "bg-primary text-white" : "bg-white text-black"
                            }`}
                        onPress={() => setSource("all")}
                    >
                        All
                    </Button>
                    <Button
                        radius="sm"
                        size="sm"
                        className={`${basePillClasses} ${source === "app" ? "bg-primary text-white" : "bg-white text-black"
                            }`}
                        onPress={() => setSource("app")}
                    >
                        App Orders
                    </Button>
                    <Button
                        radius="sm"
                        size="sm"
                        className={`${basePillClasses} ${source === "restaurant" ? "bg-primary text-white" : "bg-white text-black"
                            }`}
                        onPress={() => setSource("restaurant")}
                    >
                        Restaurant
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm">Status:</span>
                <div className="flex items-center gap-2">
                    {(["all", "pending", "confirmed", "cooking", "ready", "completed"] as StatusFilter[]).map((key) => (
                        <Button
                            key={key}
                            radius="sm"
                            size="sm"
                            className={`${basePillClasses} ${status === key ? "bg-primary text-white" : "bg-white text-black"
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