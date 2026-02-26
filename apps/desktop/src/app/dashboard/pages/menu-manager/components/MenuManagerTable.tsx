import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Button,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import { MENU_ITEMS } from "../constants/dummy_constants";

export default function MenuManagerTable() {
  return (
    <div className="px-3 pb-10 pt-5">
      <Table
        aria-label="Restaurant Menu Table"
        classNames={{
          wrapper: "shadow-sm border border-gray-100 p-0 ",
          th: "bg-neutral-100 text-black text-sm font-semibold !rounded-b-none py-5 px-6 text-left",
          td: "py-4 border-b border-gray-50",
        }}
      >
        <TableHeader>
          <TableColumn>Item Name</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>Prep Time</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {MENU_ITEMS.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-lg object-cover"
                  />
                  <span className="font-medium text-[#18181B]">
                    {item.name}
                  </span>
                </div>
              </TableCell>

              {/* Category Chip */}
              <TableCell>
                <Chip
                  variant="flat"
                  className="bg-[#E0F2FE] text-primary border-1 border-primary font-medium border-none"
                  size="sm"
                >
                  {item.category}
                </Chip>
              </TableCell>

              {/* Price */}
              <TableCell className="text-[#18181B] font-medium">
                ${item.price.toFixed(2)}
              </TableCell>

              {/* Prep Time */}
              <TableCell className="text-[#18181B]">{item.prepTime}</TableCell>

              {/* Status Chip */}
              <TableCell>
                <Chip
                  variant="flat"
                  className="bg-[#DCFCE7] text-[#22C55E] font-medium border-none"
                  size="sm"
                >
                  {item.status}
                </Chip>
              </TableCell>

              {/* Description */}
              <TableCell className="text-[#808080]">
                {item.description}
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex gap-2 justify-center">
                  <Button
                    isIconOnly
                    variant="light"
                    className="border border-gray-200 rounded-lg min-w-10 h-10"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    className="border border-gray-200 rounded-lg min-w-10 h-10"
                  >
                    <Trash2 className="w-4 h-4 text-danger" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
