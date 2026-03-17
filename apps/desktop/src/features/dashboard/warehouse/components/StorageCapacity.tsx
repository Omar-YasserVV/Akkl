import { Card, CardBody, CardHeader, Progress } from "@heroui/react";

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
    <Card
      classNames={{
        header: "p-5 pb-2",
        body: "p-5 pt-2",
      }}
    >
      <CardHeader>
        <p className="font-bold text-lg text-primary">Storage Capacity</p>
      </CardHeader>
      <CardBody className="space-y-4">
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
      </CardBody>
    </Card>
  );
};

export default StorageCapacity;
