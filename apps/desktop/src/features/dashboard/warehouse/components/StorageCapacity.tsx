import { Card, Progress } from "@heroui/react";

const StorageCapacity = () => {
  const storages = [
    {
      title: "Dry Storage",
      value: 50,
    },
    {
      title: "Cold Room",
      value: 50,
    },
    {
      title: "Freezer",
      value: 50,
    },
  ];
  return (
    <Card className="p-5 space-y-4">
      <div>
        <p className="font-bold text-lg text-primary">Storage Capacity</p>
      </div>
      <div className="space-y-4">
        {storages.map((storage) => (
          <Progress
            key={storage.title}
            value={storage.value}
            label={storage.title}
            classNames={{
              label: "text-primary",
              value: "text-primary",
              track: "bg-primary/15",
              indicator: "bg-primary",
            }}
            showValueLabel
          />
        ))}
      </div>
    </Card>
  );
};

export default StorageCapacity;
