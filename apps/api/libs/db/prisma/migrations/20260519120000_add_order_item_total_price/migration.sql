-- Add line-total column for efficient revenue aggregations (top-selling, etc.)
ALTER TABLE "OrderItem" ADD COLUMN "totalPrice" DECIMAL(10, 2);

UPDATE "OrderItem"
SET "totalPrice" = "quantity" * "price"
WHERE "totalPrice" IS NULL;

ALTER TABLE "OrderItem" ALTER COLUMN "totalPrice" SET NOT NULL;
