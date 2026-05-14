import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { useMemo } from "react";
import type {
  IngredientCategory,
  InventoryItemDto,
} from "../types/inventory.types";

const PRODUCE_BEVERAGES: IngredientCategory[] = ["PRODUCE", "BEVERAGES"];
const COLD_CHAIN: IngredientCategory[] = ["MEAT", "SEAFOOD", "DAIRY", "BAKERY"];

interface StorageCapacityProps {
  items: InventoryItemDto[];
}

const StorageCapacity = ({ items }: StorageCapacityProps) => {
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
        {items.length === 0 ? (
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
