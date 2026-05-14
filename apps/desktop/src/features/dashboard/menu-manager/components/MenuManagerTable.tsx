import {
  DASHBOARD_TABLE_SKELETON_CELL_CLASSNAME,
  DashboardTableLoadingOverlay,
  createDashboardTableLoadingRows,
} from "@/features/dashboard/components/shared/DashboardTableLoading";
import PaginationButtons from "@/features/dashboard/components/shared/PaginationButtons";
import { usePaginatedBranchMenu } from "@/hooks/Menu/FetchMenu";
import { MenuFilters } from "@/types/Menu";
import {
  Button,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MENU_COLUMNS } from "../constants/MenuColumns";

const loadingRows = createDashboardTableLoadingRows();

type MenuManagerTableProps = {
  filters: MenuFilters;
  onChange: (filters: Partial<MenuFilters>) => void;
};

export default function MenuManagerTable({
  filters,
  onChange,
}: MenuManagerTableProps) {
  const {
    data: branchMenu,
    isLoading: isLoadingMenu,
    isFetching: isFetchingMenu,
  } = usePaginatedBranchMenu(filters);

  const menuItems = branchMenu?.data ?? [];
  const totalPages = branchMenu?.meta.pages ?? 1;
  const currentPage = branchMenu?.meta.currentPage ?? filters.page;

  return (
    <div>
      <div className="relative">
        <Table
          aria-label="Restaurant Menu Table"
          layout="fixed"
          classNames={{
            wrapper: "shadow-sm border border-slate-100 p-0",
            th: "bg-slate-50 text-zinc-900 text-sm font-semibold !rounded-b-none py-5 px-6",
            td: "py-4 border-b border-slate-50",
            tr: isFetchingMenu && !isLoadingMenu ? "opacity-40" : "",
          }}
        >
          <TableHeader columns={MENU_COLUMNS}>
            {(column) => (
              <TableColumn key={column.key} align={column.align}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          {isLoadingMenu ? (
            <TableBody>
              {loadingRows.map((item) => (
                <TableRow key={item.id}>
                  {Array.from({ length: MENU_COLUMNS.length }, (_, index) => (
                    <TableCell key={`loading-cell-${item.id}-${index}`}>
                      <Skeleton
                        className={DASHBOARD_TABLE_SKELETON_CELL_CLASSNAME}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody emptyContent="No menu items yet.">
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-11 h-11 rounded-lg object-cover"
                        />
                      )}
                      <span className="font-medium text-zinc-900">
                        {item.name}
                      </span>
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
                    ${item.price}
                  </TableCell>

                  <TableCell className="text-zinc-900 text-center">
                    {item.preparationTime || "-"}
                  </TableCell>

                  <TableCell>
                    <div className="flex">
                      <Chip
                        variant="flat"
                        className={
                          item.isAvailable
                            ? "bg-green-100 text-green-800 font-semibold"
                            : "bg-red-100 text-red-800 font-semibold"
                        }
                        size="sm"
                      >
                        {item.isAvailable ? "Active" : "Inactive"}
                      </Chip>
                    </div>
                  </TableCell>

                  <TableCell className="text-slate-500 text-center">
                    <span className="block truncate max-w-48 mx-auto">
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
          )}
        </Table>
        {isFetchingMenu && !isLoadingMenu && <DashboardTableLoadingOverlay />}
      </div>
      {totalPages > 1 && (
        <PaginationButtons
          page={currentPage}
          total={totalPages}
          onChange={(page) => onChange({ page })}
        />
      )}
    </div>
  );
}
