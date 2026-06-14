import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import React from "react";
import { BiPlus, BiX } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  DUMMY_EXPENSES,
  type Expense,
  type ExpenseCategory,
} from "../constants/expenses-constants";

type ColumnKey = "date" | "description" | "category" | "amount" | "actions";

const columns: Array<{
  name: string;
  uid: ColumnKey;
  align?: "start" | "center" | "end";
}> = [
  { name: "Date", uid: "date", align: "start" },
  { name: "Description", uid: "description", align: "start" },
  { name: "Category", uid: "category", align: "start" },
  { name: "Amount", uid: "amount", align: "start" },
  { name: "Actions", uid: "actions", align: "start" },
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Supplies",
  "Facilities",
  "Marketing",
  "Salaries",
  "Other",
];

const categoryColorMap: Record<ExpenseCategory, string> = {
  Supplies: "bg-blue-50 text-blue-600 border-blue-100",
  Facilities: "bg-indigo-50 text-indigo-600 border-indigo-100",
  Marketing: "bg-pink-50 text-pink-600 border-pink-100",
  Salaries: "bg-green-50 text-green-600 border-green-100",
  Other: "bg-gray-50 text-gray-600 border-gray-100",
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

const CategoryChip = ({ category }: { category: ExpenseCategory }) => (
  <span
    className={`inline-flex items-center rounded-full text-black px-3 py-1 text-xs font-medium border ${categoryColorMap[category] || categoryColorMap.Other}`}
  >
    {category}
  </span>
);

// ── Form state ──────────────────────────────────────────────────────────────

type FormFields = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  date: any;
  description: string;
  category: string;
  amount: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

const EMPTY_FORM: FormFields = {
  date: null,
  description: "",
  category: "",
  amount: "",
};

function validateForm(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (fields.date == null) {
    errors.date = "Date is required.";
  }

  if (!fields.description.trim()) {
    errors.description = "Description is required.";
  }

  if (!fields.category) {
    errors.category = "Please select a category.";
  }

  const amt = parseFloat(fields.amount);
  if (!fields.amount.trim()) {
    errors.amount = "Amount is required.";
  } else if (isNaN(amt) || amt <= 0) {
    errors.amount = "Enter a valid amount greater than 0.";
  }

  return errors;
}

// ── Component ────────────────────────────────────────────────────────────────

const RecentExpenses = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [expenses, setExpenses] = React.useState<Expense[]>(DUMMY_EXPENSES);
  const [form, setForm] = React.useState<FormFields>(EMPTY_FORM);
  const [errors, setErrors] = React.useState<FormErrors>({});

  const handleChange = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (value: any) => {
    setForm((prev) => ({ ...prev, date: value }));
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const handleSave = (onClose: () => void) => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Format DateValue → "MM/DD/YYYY"
    const d = form.date!;
    const formatted = `${String(d.month).padStart(2, "0")}/${String(d.day).padStart(2, "0")}/${d.year}`;

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      date: formatted,
      description: form.description.trim(),
      category: form.category as ExpenseCategory,
      amount: parseFloat(form.amount),
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleModalClose = (onClose: () => void) => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  const renderCell = React.useCallback(
    (expense: Expense, columnKey: React.Key) => {
      const key = columnKey as ColumnKey;
      switch (key) {
        case "date":
          return <span className="text-black font-medium">{expense.date}</span>;
        case "description":
          return (
            <span className="text-black font-medium">
              {expense.description}
            </span>
          );
        case "category":
          return <CategoryChip category={expense.category} />;
        case "amount":
          return (
            <span className="text-black font-bold">
              {formatMoney(expense.amount)}
            </span>
          );
        case "actions":
          return (
            <Tooltip color="danger" content="Delete">
              <button
                type="button"
                onClick={() => handleDelete(expense.id)}
                className="h-9 w-12 rounded-sm border border-card bg-white text-rose-500 inline-flex items-center justify-center hover:bg-rose-50 transition-colors"
                aria-label="Delete expense"
              >
                <FaRegTrashAlt className="h-4 w-4" />
              </button>
            </Tooltip>
          );
        default:
          return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Card className="w-full bg-white dark:bg-zinc-900 border-none shadow-sm rounded-lg overflow-hidden mt-6">
      <CardHeader className="flex items-center justify-between px-6 py-6 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
          Recent Expenses
        </h3>
        <Button
          onPress={onOpen}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 gap-2"
        >
          <BiPlus className="text-xl" />
          Add Expenses
        </Button>
      </CardHeader>

      <CardBody className="px-6">
        <div className="w-full rounded-sm font-normal text-black border border-default-200 bg-white overflow-hidden shadow-sm">
          <Table
            aria-label="Recent expenses table"
            removeWrapper
            classNames={{
              table: "min-w-full",
              thead: "shadow-none",
              th: "bg-card !rounded-none text-black font-bold text-sm py-4 px-6 border-none after:content-none",
              td: "py-5 px-6 border-b border-default-200",
              tr: "shadow-none border-none",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.align}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={expenses} emptyContent="No expenses recorded.">
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardBody>

      {/* ── Add Expense Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        hideCloseButton
        className="bg-white dark:bg-zinc-900 rounded-2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-between pb-4 px-6 pt-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Add New Expense
                </h3>
                <button
                  onClick={() => handleModalClose(onClose)}
                  className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <BiX className="text-2xl text-zinc-500" />
                </button>
              </ModalHeader>

              <ModalBody className="px-6 py-4 space-y-4">
                {/* Date picker */}
                <DatePicker
                  label="Date"
                  variant="bordered"
                  labelPlacement="outside"
                  value={form.date}
                  onChange={handleDateChange}
                  maxValue={today(getLocalTimeZone())}
                  isInvalid={!!errors.date}
                  errorMessage={errors.date}
                  classNames={{
                    label:
                      "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
                    inputWrapper:
                      "border-zinc-200 dark:border-zinc-700 rounded-xl",
                  }}
                />

                {/* Description */}
                <Input
                  label="Description"
                  placeholder="Enter expense description"
                  variant="bordered"
                  labelPlacement="outside"
                  value={form.description}
                  onValueChange={(v) => handleChange("description", v)}
                  isInvalid={!!errors.description}
                  errorMessage={errors.description}
                  classNames={{
                    label:
                      "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
                    inputWrapper:
                      "border-zinc-200 dark:border-zinc-700 rounded-xl",
                  }}
                />

                {/* Category */}
                <Select
                  label="Category"
                  placeholder="Select category"
                  variant="bordered"
                  labelPlacement="outside"
                  selectedKeys={
                    form.category ? new Set([form.category]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0]?.toString() ?? "";
                    handleChange("category", value);
                  }}
                  isInvalid={!!errors.category}
                  errorMessage={errors.category}
                  classNames={{
                    label:
                      "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
                    trigger: "border-zinc-200 dark:border-zinc-700 rounded-xl",
                  }}
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat}>{cat}</SelectItem>
                  ))}
                </Select>

                {/* Amount */}
                <Input
                  label="Amount"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  startContent={<span className="text-zinc-400">$</span>}
                  variant="bordered"
                  labelPlacement="outside"
                  value={form.amount}
                  onValueChange={(v) => handleChange("amount", v)}
                  isInvalid={!!errors.amount}
                  errorMessage={errors.amount}
                  classNames={{
                    label:
                      "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
                    inputWrapper:
                      "border-zinc-200 dark:border-zinc-700 rounded-xl",
                  }}
                />
              </ModalBody>

              <ModalFooter className="px-6 py-6 gap-3">
                <Button
                  variant="ghost"
                  className="border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-medium rounded-xl px-6"
                  onPress={() => handleModalClose(onClose)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8"
                  onPress={() => handleSave(onClose)}
                >
                  Save Expense
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default RecentExpenses;
