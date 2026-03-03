import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    useDisclosure,
    Card,
    CardHeader,
    CardBody,
} from "@heroui/react";
import { BiPlus, BiX } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { DUMMY_EXPENSES, type Expense, type ExpenseCategory } from "../constants/expenses-constants";

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

const categoryColorMap: Record<ExpenseCategory, string> = {
    Supplies: "bg-blue-50 text-blue-600 border-blue-100",
    Facilities: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Marketing: "bg-pink-50 text-pink-600 border-pink-100",
    Salaries: "bg-green-50 text-green-600 border-green-100",
    Other: "bg-gray-50 text-gray-600 border-gray-100",
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

const CategoryChip = ({ category }: { category: ExpenseCategory }) => {
    return (
        <span
            className={`inline-flex items-center rounded-full text-black px-3 py-1 text-xs font-medium border ${categoryColorMap[category] || categoryColorMap.Other}`}
        >
            {category}
        </span>
    );
};

const RecentExpenses = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const renderCell = React.useCallback((expense: Expense, columnKey: React.Key) => {
        const key = columnKey as ColumnKey;

        switch (key) {
            case "date":
                return <span className="text-black font-medium">{expense.date}</span>;
            case "description":
                return <span className="text-black font-medium">{expense.description}</span>;
            case "category":
                return <CategoryChip category={expense.category} />;
            case "amount":
                return <span className="text-black font-bold">{formatMoney(expense.amount)}</span>;
            case "actions":
                return (
                    <Tooltip color="danger" content="Delete">
                        <button
                            type="button"
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
    }, []);

    return (
        <Card className="w-full bg-white dark:bg-zinc-900 border-none shadow-sm rounded-lg overflow-hidden mt-6">
            <CardHeader className="flex items-center justify-between px-6 py-6 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Recent Expenses</h3>
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
                        <TableBody items={DUMMY_EXPENSES} emptyContent="No expenses recorded.">
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
                                    onClick={onClose}
                                    className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <BiX className="text-2xl text-zinc-500" />
                                </button>
                            </ModalHeader>
                            <ModalBody className="px-6 py-4 space-y-4">
                                <Input
                                    label="Date"
                                    placeholder="MM/DD/YYYY"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    classNames={{
                                        label: "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
                                        inputWrapper: "border-zinc-200 dark:border-zinc-700 rounded-xl",
                                    }}
                                />
                                <Input
                                    label="Description"
                                    placeholder="Enter expense description"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    classNames={{
                                        label: "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
                                        inputWrapper: "border-zinc-200 dark:border-zinc-700 rounded-xl",
                                    }}
                                />
                                <Select
                                    label="Category"
                                    placeholder="Select category"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    classNames={{
                                        label: "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
                                        trigger: "border-zinc-200 dark:border-zinc-700 rounded-xl",
                                    }}
                                >
                                    <SelectItem key="supplies">Supplies</SelectItem>
                                    <SelectItem key="facilities">Facilities</SelectItem>
                                    <SelectItem key="marketing">Marketing</SelectItem>
                                    <SelectItem key="salaries">Salaries</SelectItem>
                                    <SelectItem key="other">Other</SelectItem>
                                </Select>
                                <Input
                                    label="Amount"
                                    placeholder="0.00"
                                    type="number"
                                    startContent={<span className="text-zinc-400">$</span>}
                                    variant="bordered"
                                    labelPlacement="outside"
                                    classNames={{
                                        label: "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
                                        inputWrapper: "border-zinc-200 dark:border-zinc-700 rounded-xl",
                                    }}
                                />
                            </ModalBody>
                            <ModalFooter className="px-6 py-6 gap-3">
                                <Button
                                    variant="ghost"
                                    className="border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-medium rounded-xl px-6"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8"
                                    onPress={onClose}
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

