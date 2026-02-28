import { Button } from "@heroui/react"
import { Select, SelectItem } from "@heroui/react";

export const daysFilter = [
    { key: "day", label: "Last 24 hours" },
    { key: "week", label: "Last 7 days" },
    { key: "month", label: "Last 30 days" },
]

const FinanceHeader = () => {
    return (
        <header className="flex justify-between items-end">
            <div className="flex flex-col items-start justify-end gap-2">
                <h2 className="font-cherry text-primary text-5xl">
                    Finance & Reports
                </h2>
                <p className="text-muted-foreground">
                    Track revenue, expenses, and profitability.
                </p>
            </div>
            <div className="flex justify-end items-end gap-4">
                <Select
                    className="w-36 text-center bg-white rounded-md"
                    items={daysFilter}
                    defaultSelectedKeys={["day"]}
                    variant="bordered"
                    radius="md"
                    disallowEmptySelection
                    classNames={{
                        trigger: "border-1 border-default-200 shadow-none h-10 px-4",
                        value: "text-default-700 font-normal",
                    }}
                >
                    {daysFilter.map((filter) => (
                        <SelectItem key={filter.key}>{filter.label}</SelectItem>
                    ))}
                </Select>
                <Button
                    className="bg-primary rounded-md text-center px-4 text-md text-white py-3"
                >
                    Export as PDF
                </Button>
            </div>
        </header>
    )
}

export default FinanceHeader