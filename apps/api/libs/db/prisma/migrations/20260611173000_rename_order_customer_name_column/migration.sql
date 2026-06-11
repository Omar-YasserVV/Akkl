-- Align Order.customerName column name with Prisma schema (camelCase).
ALTER TABLE "Order" RENAME COLUMN "CustomerName" TO "customerName";
