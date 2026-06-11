-- Align PostgreSQL enum type names with Prisma schema (PascalCase standard).
ALTER TYPE "category" RENAME TO "MenuCategory";
ALTER TYPE "source" RENAME TO "OrderSource";
ALTER TYPE "stockStatus" RENAME TO "StockStatus";
