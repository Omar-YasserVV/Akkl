// shared types and dummy data for the recent expenses table

export type ExpenseID = string;
export type ExpenseCategory = "Supplies" | "Facilities" | "Marketing" | "Salaries" | "Other";

export interface Expense {
    id: ExpenseID;
    date: string;
    description: string;
    category: ExpenseCategory;
    amount: number;
}

// dummy data to be used until the backend is ready
export const DUMMY_EXPENSES: Expense[] = [
    {
        id: "EXP001",
        date: "2/24/2026",
        description: "Ingredients",
        category: "Supplies",
        amount: 500.00,
    },
    {
        id: "EXP002",
        date: "2/24/2026",
        description: "Rent",
        category: "Facilities",
        amount: 2000.00,
    },
    {
        id: "EXP003",
        date: "2/23/2026",
        description: "Social Media Ads",
        category: "Marketing",
        amount: 150.00,
    },
    {
        id: "EXP004",
        date: "2/22/2026",
        description: "Electricity Bill",
        category: "Facilities",
        amount: 320.50,
    },
];
