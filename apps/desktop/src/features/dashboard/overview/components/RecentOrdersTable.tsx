import { useOrders } from "@/hooks/Orders/FetchOrders";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useTimeAgo } from "@repo/hooks";
import Chip from "@repo/ui/components/chip";

const TimeDisplay = ({ date }: { date: string }) => {
  const timeAgo = useTimeAgo(date); // Hook is top-level here
  return <>{timeAgo}</>;
};

const RecentOrdersTable = () => {
  const { data } = useOrders({
    page: 1,
    limit: 5,
  });

  console.log(data);

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
            {data?.data?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-default-700">
                  {order.id.slice(0, 8)}
                </TableCell>
                <TableCell>{order.CustomerName}</TableCell>
                <TableCell>{order.totalPrice}</TableCell>
                <TableCell>
                  <Chip variant="flat" size="sm" value={order.status} />
                </TableCell>
                <TableCell className="text-default-400">
                  <TimeDisplay date={order.createdAt} />
                </TableCell>
              </TableRow>
            )) || []}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default RecentOrdersTable;
