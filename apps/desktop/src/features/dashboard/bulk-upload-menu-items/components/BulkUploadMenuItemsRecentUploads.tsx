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
import {
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiDotsVertical,
} from "react-icons/hi";

const BulkUploadMenuItemsRecentUploads = () => {
  type StatusColor =
    | "success"
    | "primary"
    | "danger"
    | "default"
    | "secondary"
    | "warning";

  interface UploadItem {
    id: number;
    fileName: string;
    date: string;
    status: string;
    type: StatusColor; // This tells TS to expect ONLY those specific strings
  }
  const data: UploadItem[] = [
    {
      id: 1,
      fileName: "Winter_Menu_2024.csv",
      date: "Oct 24, 2023 10:30 AM",
      status: "Completed",
      type: "success",
    },
    {
      id: 2,
      fileName: "Daily_Specials_Draft.xlsx",
      date: "Oct 23, 2023 04:15 PM",
      status: "In Progress",
      type: "primary",
    },
    {
      id: 3,
      fileName: "Dessert_Items_v2.csv",
      date: "Oct 21, 2023 11:20 AM",
      status: "Failed (4 Errors)",
      type: "danger",
    },
  ];
  // TODO: refactor to fetch real data from backend and handle actions like "Fix Errors" and "View Details"
  return (
    <div className="flex flex-col gap- bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Custom Header */}
      <div className="flex justify-between items-center py-2 px-6">
        <h3 className="text-primary font-bold text-[16px]">Recent Uploads</h3>
        <Button
          variant="light"
          color="primary"
          className="font-semibold text-sm"
        >
          View all
        </Button>
      </div>

      <Table
        classNames={{
          thead: "bg-[#F8FAFC]",
          th: "rounded-none!",
        }}
        aria-label="Recent uploads table"
        shadow="none"
        className="pb-2"
        removeWrapper
      >
        <TableHeader className="rounded-b-none!">
          <TableColumn className="bg-slate-50/50 text-slate-500 font-bold uppercase py-4">
            FILE NAME
          </TableColumn>
          <TableColumn className="bg-slate-50/50 text-slate-500 font-bold uppercase py-4">
            DATE
          </TableColumn>
          <TableColumn className="bg-slate-50/50 text-slate-500 font-bold uppercase py-4">
            STATUS
          </TableColumn>
          <TableColumn className="bg-slate-50/50 text-slate-500 font-bold uppercase py-4 text-center">
            ACTIONS
          </TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className="border-b border-slate-50 last:border-none"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  {item.type === "danger" ? (
                    <HiOutlineExclamationCircle className="text-slate-400 text-2xl" />
                  ) : (
                    <HiOutlineDocumentText className="text-slate-400 text-2xl" />
                  )}
                  <span className="text-primary font-medium cursor-pointer">
                    {item.fileName}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-slate-500 text-sm">
                {item.date}
              </TableCell>
              <TableCell>
                <Chip
                  className="capitalize border-none px-2"
                  color={item.type}
                  size="sm"
                  variant="flat"
                  startContent={
                    <div
                      className={`w-1.5 h-1.5 rounded-full bg-current/60 mr-1 `}
                    />
                  }
                >
                  <div className="font-semibold text-[12px]">{item.status}</div>
                </Chip>
              </TableCell>
              <TableCell className="text-center">
                {item.type === "danger" ? (
                  <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    className="font-bold"
                  >
                    Fix Errors
                  </Button>
                ) : (
                  <Button isIconOnly variant="light" radius="full" size="sm">
                    <HiDotsVertical className="text-slate-400 text-lg" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BulkUploadMenuItemsRecentUploads;
