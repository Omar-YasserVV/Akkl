import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { NumberFormatter } from "@repo/utils";
import { FiChevronDown } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import { Link } from "react-router-dom";

const StockLevelsTable = ({ data }: { data: any[] }) => {
  const Column = ["Item Name", "Category", "Current Stock", "Status", "Action"];
  return (
    <Card
      classNames={{
        header: "p-5",
        body: "p-0",
      }}
      className="col-span-3 row-start-1 row-span-3"
    >
      <CardHeader className="justify-between">
        <p className="font-bold capitalize">stock levels</p>
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize"
              variant="bordered"
              endContent={<FiChevronDown />}
            >
              All Categories
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            selectionMode="single"
            variant="flat"
          >
            <DropdownItem key="text">Text</DropdownItem>
            <DropdownItem key="number">Number</DropdownItem>
            <DropdownItem key="date">Date</DropdownItem>
            <DropdownItem key="single_date">Single Date</DropdownItem>
            <DropdownItem key="iteration">Iteration</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <Divider />
      <CardBody>
        <Table
          aria-label="Example static collection table"
          isHeaderSticky
          classNames={{
            wrapper: "rounded-none p-0",
            base: "max-h-full",
            th: "px-5 !rounded-none py-7 font-bold",
            td: "px-5 py-4 border-b border-default-100",
          }}
        >
          <TableHeader className="rounded-none">
            {Column.map((item) => (
              <TableColumn className="uppercase" key={item}>
                {item}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.itemName}>
                <TableCell className="font-medium">{item.itemName}</TableCell>
                <TableCell className="text-default-600">
                  {item.category}
                </TableCell>
                <TableCell className="font-semibold">
                  {NumberFormatter.getNumberOnly(item.currentStock, {
                    unit: item.unit,
                    isCompact: true,
                    unitStyle: "text-default-400",
                  })}
                </TableCell>
                <TableCell>
                  <Chip>{item.status}</Chip>
                </TableCell>
                <TableCell>
                  <Button variant="light" isIconOnly>
                    <MdOutlineEdit size={20} className="text-primary" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
      <Divider />
      <CardFooter className="p-5">
        <Link to={""} className="text-center w-full text-blue-700 font-medium">
          View All Inventory
        </Link>
      </CardFooter>
    </Card>
  );
};

export default StockLevelsTable;
