import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Chip as HeroChip,
  Select,
  SelectItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import Chip from "@repo/ui/components/chip";
import { NumberFormatter } from "@repo/utils";
import type { ReactNode } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import type { InventoryItemDto, StockStatus } from "../types/inventory.types";

const STOCK_FILTER_OPTIONS: { key: string; label: string }[] = [
  { key: "ALL", label: "All statuses" },
  { key: "IN_STOCK", label: "In stock" },
  { key: "LOW_STOCK", label: "Low stock" },
  { key: "OUT_OF_STOCK", label: "Out of stock" },
];

const chipColor = (status: StockStatus) => {
  switch (status) {
    case "IN_STOCK":
      return "success";
    case "LOW_STOCK":
      return "warning";
    case "OUT_OF_STOCK":
      return "danger";
    default:
      return "default";
  }
};

export interface StockLevelsTableProps {
  data: InventoryItemDto[];
  isLoading: boolean;
  stockStatusKey: string;
  onStockStatusChange: (key: string) => void;
  onRowAction: (
    item: InventoryItemDto,
    mode: "consume" | "restock" | "editMin",
  ) => void;
  pagination?: ReactNode;
}

const StockLevelsTable = ({
  data,
  isLoading,
  stockStatusKey,
  onStockStatusChange,
  onRowAction,
  pagination,
}: StockLevelsTableProps) => {
  const columns = [
    "Item Name",
    "Category",
    "Current Stock",
    "Status",
    "Action",
  ];

  return (
    <Card
      classNames={{
        header: "p-5",
        body: "p-0",
      }}
      className="col-span-3 row-start-1 row-span-3"
    >
      <CardHeader className="justify-between flex-wrap gap-3">
        <p className="font-bold capitalize">stock levels</p>
        <Select
          aria-label="Filter by stock status"
          className="max-w-xs capitalize"
          selectedKeys={new Set([stockStatusKey])}
          onSelectionChange={(keys) => {
            const k = [...keys][0];
            if (typeof k === "string") onStockStatusChange(k);
          }}
          size="sm"
          variant="bordered"
        >
          {STOCK_FILTER_OPTIONS.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      </CardHeader>
      <Divider />
      <CardBody>
        <Table
          aria-label="Inventory stock levels"
          isHeaderSticky
          classNames={{
            wrapper: "rounded-none p-0",
            base: "max-h-full",
            th: "px-5 !rounded-none py-7 font-bold",
            td: "px-5 py-4 border-b border-default-100",
          }}
        >
          <TableHeader>
            {columns.map((item) => (
              <TableColumn className="uppercase" key={item}>
                {item}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            emptyContent={
              !isLoading && data.length === 0 ? "No inventory lines yet." : " "
            }
          >
            {isLoading
              ? [...Array(10)].map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-3/4 rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-1/2 rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-1/4 rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              : data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.ingredient.name}
                    </TableCell>
                    <TableCell className="text-default-600">
                      <Chip value={item.ingredient.category}></Chip>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {NumberFormatter.getNumberOnly(item.quantity, {
                        unit: item.ingredient.unit,
                        isCompact: true,
                        unitStyle: "text-default-400",
                      })}
                    </TableCell>
                    <TableCell>
                      <HeroChip
                        color={chipColor(item.stockStatus)}
                        variant="flat"
                        size="sm"
                      >
                        {String(item.stockStatus).replace(/_/g, " ")}
                      </HeroChip>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            variant="light"
                            isIconOnly
                            aria-label="Row actions"
                          >
                            <MdOutlineEdit size={20} className="text-primary" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Inventory actions">
                          <DropdownItem
                            key="consume"
                            onPress={() => onRowAction(item, "consume")}
                          >
                            Record usage
                          </DropdownItem>
                          <DropdownItem
                            key="restock"
                            onPress={() => onRowAction(item, "restock")}
                          >
                            Restock
                          </DropdownItem>
                          <DropdownItem
                            key="editMin"
                            onPress={() => onRowAction(item, "editMin")}
                          >
                            Edit minimum
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardBody>
      {pagination ? (
        <div className="border-t border-default-100 px-2">{pagination}</div>
      ) : null}
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
