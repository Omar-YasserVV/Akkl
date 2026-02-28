import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@heroui/react";
import { MENU_ITEMS } from "../constants/dummy_constants";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

export default function MenuManagerTable() {
  return (
    <div>
      <Table
        aria-label="Restaurant Menu Table"
        layout="fixed" // Add this propss
        classNames={{
          wrapper: "shadow-sm border border-gray-100 p-0 ",
          th: "bg-neutral-100 text-black text-sm font-semibold !rounded-b-none py-5 px-6",
          td: "py-4 border-b border-gray-50",
        }}
      >
        <TableHeader>
          {/* Item Name: Takes up remaining space or a larger fixed portion */}
          <TableColumn className="w-50">Item Name</TableColumn>

          {/* Middle Columns: Compact widths */}
          <TableColumn align="start" className="w-[13%]">
            Category
          </TableColumn>
          <TableColumn align="center" className="w-[10%]">
            Price
          </TableColumn>
          <TableColumn align="center" className="w-[10%]">
            Prep Time
          </TableColumn>
          <TableColumn align="start" className="w-[10%]">
            Status
          </TableColumn>

          {/* Description: Flexes to fill or has a larger width */}
          <TableColumn align="center" className="w-[25%]">
            Description
          </TableColumn>

          {/* Actions: Fixed small width */}
          <TableColumn align="start" className="w-[18%]">
            Actions
          </TableColumn>
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

              <TableCell>
                <div className="flex ml-3">
                  <span
                    className={`inline-flex items-center rounded-full text-primary bg- px-3 py-1 text-xs font-medium border border-primary/20 bg-primary/10`}
                  >
                    {item.category}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-[#18181B] font-medium text-center">
                ${item.price.toFixed(2)}
              </TableCell>

              <TableCell className="text-[#18181B] text-center">
                {item.prepTime}
              </TableCell>

              <TableCell>
                <div className="flex">
                  <Chip
                    variant="flat"
                    className="bg-[#DCFCE7] text-[#166534] font-semibold"
                    size="sm"
                  >
                    {item.status}
                  </Chip>
                </div>
              </TableCell>

              <TableCell className="text-[#808080] text-center">
                <span className="block truncate max-w-50 mx-auto">
                  {item.description}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex gap-2 justify-start">
                  <Button
                    isIconOnly
                    variant="light"
                    className="border border-gray-200 rounded-lg min-w-10 h-10"
                  >
                    <FiEdit className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    className="border border-gray-200 rounded-lg min-w-10 h-10"
                  >
                    <FaRegTrashAlt className="w-4 h-4 text-danger" />
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
