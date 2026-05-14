import { Card, CardBody, CardHeader, Progress, Skeleton } from "@heroui/react";
import { useMemo } from "react";
import type {
  IngredientCategory,
  InventoryItemDto,
} from "../types/inventory.types";

const PRODUCE_BEVERAGES: IngredientCategory[] = ["PRODUCE", "BEVERAGES"];
const COLD_CHAIN: IngredientCategory[] = ["MEAT", "SEAFOOD", "DAIRY", "BAKERY"];

interface StorageCapacityProps {
  items: InventoryItemDto[];
  isLoading?: boolean;
}

const StorageCapacity = ({ items, isLoading }: StorageCapacityProps) => {
  const bands = useMemo(() => {
    const sum = (cats: IngredientCategory[]) =>
      items
        .filter((i) => cats.includes(i.ingredient.category))
        .reduce((a, i) => a + i.quantity, 0);

    const dryPantry = items
      .filter(
        (i) =>
          !PRODUCE_BEVERAGES.includes(i.ingredient.category) &&
          !COLD_CHAIN.includes(i.ingredient.category),
      )
      .reduce((a, i) => a + i.quantity, 0);

    const produce = sum(PRODUCE_BEVERAGES);
    const cold = sum(COLD_CHAIN);
    const total = produce + cold + dryPantry || 1;

    return [
      {
        title: "Produce & beverages",
        value: Math.round((produce / total) * 100),
      },
      {
        title: "Cold chain (meat, dairy, bakery)",
        value: Math.round((cold / total) * 100),
      },
      {
        title: "Dry pantry & other",
        value: Math.round((dryPantry / total) * 100),
      },
    ];
  }, [items]);

  return (
    <Card
      classNames={{
        header: "p-5 pb-2",
        body: "p-5 pt-2",
      }}
    >
      <CardHeader>
        <p className="font-bold text-lg text-primary">
          Storage mix by category
        </p>
      </CardHeader>
      <CardBody className="space-y-4">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32 rounded-lg" />
                  <Skeleton className="h-4 w-8 rounded-lg" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-default-500">No inventory to chart yet.</p>
        ) : (
          bands.map((storage) => (
            <Progress
              key={storage.title}
              value={storage.value}
              label={storage.title}
              classNames={{
                label: "text-primary",
                value: "text-primary",
                track: "bg-primary/15 h-2",
                indicator: "bg-primary",
              }}
              showValueLabel
            />
          ))
        )}
      </CardBody>
    </Card>
  );
};

export default StorageCapacity;
