// shared types and dummy data for the live orders table

export type OrderID = string;
export type CustomerName = string;
export type OrderSource = "App" | "Restaurant";
export type ItemCount = number;
export type OrderTotal = number; // in dollars, e.g. 12.99
export type OrderStatus = "pending" | "cooking" | "ready";

export interface LiveOrder {
    "order#": OrderID;        // order #
    customer: CustomerName;
    source: OrderSource;    // where order originated
    items: ItemCount;       // how many items
    total: OrderTotal;      // total cost
    status: OrderStatus;    // current status
}

// dummy data to be used until the backend is ready
export const DUMMY_ORDERS: LiveOrder[] = [
    {
        "order#": "ORD001",
        customer: "John Doe",
        source: "App",
        items: 1,
        total: 17.98,
        status: "pending",
    },
    {
        "order#": "ORD001",
        customer: "John Doe",
        source: "App",
        items: 1,
        total: 17.98,
        status: "cooking",
    },
    {
        "order#": "ORD002",
        customer: "Jane Smith",
        source: "Restaurant",
        items: 1,
        total: 12.99,
        status: "pending",
    },
    {
        "order#": "ORD002",
        customer: "Jane Smith",
        source: "Restaurant",
        items: 1,
        total: 12.99,
        status: "ready",
    },
];