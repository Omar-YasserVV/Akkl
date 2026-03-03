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
        layout="fixed"
        classNames={{
          wrapper: "shadow-sm border border-slate-100 p-0",
          th: "bg-slate-50 text-zinc-900 text-sm font-semibold !rounded-b-none py-5 px-6",
          td: "py-4 border-b border-slate-50",
        }}
      >
        <TableHeader>
          <TableColumn>Item Name</TableColumn>
          <TableColumn align="start">Category</TableColumn>
          <TableColumn align="center">Price</TableColumn>
          <TableColumn align="center">Prep Time</TableColumn>
          <TableColumn align="start">Status</TableColumn>
          <TableColumn align="center">Description</TableColumn>
          <TableColumn align="start">Actions</TableColumn>
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
                  <span className="font-medium text-zinc-900">{item.name}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex ml-3">
                  <span className="inline-flex items-center rounded-full text-primary px-3 py-1 text-xs font-medium border border-primary/20 bg-primary/10">
                    {item.category}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-zinc-900 font-medium text-center">
                ${item.price.toFixed(2)}
              </TableCell>

              <TableCell className="text-zinc-900 text-center">
                {item.prepTime}
              </TableCell>

              <TableCell>
                <div className="flex">
                  <Chip
                    variant="flat"
                    className="bg-green-100 text-green-800 font-semibold"
                    size="sm"
                  >
                    {item.status}
                  </Chip>
                </div>
              </TableCell>

              <TableCell className="text-slate-500 text-center">
                <span className="block truncate max-w-50 mx-auto">
                  {item.description}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex gap-2 justify-start">
                  <Button
                    isIconOnly
                    variant="light"
                    className="border border-slate-200 rounded-lg min-w-10 h-10"
                  >
                    <FiEdit className="w-4 h-4 text-slate-600" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    className="border border-slate-200 rounded-lg min-w-10 h-10"
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
