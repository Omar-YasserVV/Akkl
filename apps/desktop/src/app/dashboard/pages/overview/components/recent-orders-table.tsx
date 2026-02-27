import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";

// Mock data for the table
const orders = [
  {
    id: "ORD-7281",
    customer: "Alex Rivera",
    amount: "$125.50",
    status: "Completed",
    time: "2 mins ago",
  },
  {
    id: "ORD-7282",
    customer: "Sarah Chen",
    amount: "$45.00",
    status: "Processing",
    time: "15 mins ago",
  },
  {
    id: "ORD-7283",
    customer: "Marcus Wright",
    amount: "$89.20",
    status: "Cancelled",
    time: "1 hour ago",
  },
  {
    id: "ORD-7284",
    customer: "Elena G.",
    amount: "$210.00",
    status: "Completed",
    time: "3 hours ago",
  },
  {
    id: "ORD-7282",
    customer: "Sarah Chen",
    amount: "$45.00",
    status: "Processing",
    time: "15 mins ago",
  },
  {
    id: "ORD-7283",
    customer: "Marcus Wright",
    amount: "$89.20",
    status: "Cancelled",
    time: "1 hour ago",
  },
];

const statusColorMap: Record<
  string,
  "success" | "warning" | "danger" | "default"
> = {
  Completed: "success",
  Processing: "warning",
  Cancelled: "danger",
};

// TODO: implement a general status chips component

const RecentOrdersTable = () => {
  return (
    <Card className="border border-default-200 col-span-3" shadow="none">
      <CardHeader className="flex flex-col items-start px-6 pt-5 space-y-1">
        <p className="text-2xl font-semibold">Recent Orders</p>
        <p className="text-default-500 text-sm">
          Latest orders from app and restaurant
        </p>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Recent orders table"
          removeWrapper
          isHeaderSticky
          classNames={{
            tbody: "divide-y divide-default-100",
            th: "bg-transparent text-default-500 border-b border-default-100",
            thead:
              "[&>tr]:first:rounded-none [&>tr]:first:shadow-none bg-white",
          }}
        >
          <TableHeader>
            <TableColumn>ORDER ID</TableColumn>
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>TIME</TableColumn>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-default-700">
                  {order.id}
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Chip
                    variant="flat"
                    size="sm"
                    color={statusColorMap[order.status] || "default"}
                  >
                    {order.status}
                  </Chip>
                </TableCell>
                <TableCell className="text-default-400">{order.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default RecentOrdersTable;
