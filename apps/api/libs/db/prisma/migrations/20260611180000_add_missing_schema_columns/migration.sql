-- Add columns introduced in Prisma schema but missing from the database.

-- OrderItem.variationId (optional link to menu size/variation)
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "variationId" TEXT;

ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_variationId_fkey";
ALTER TABLE "OrderItem"
  ADD CONSTRAINT "OrderItem_variationId_fkey"
  FOREIGN KEY ("variationId") REFERENCES "MenuItemVariation"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Table.status
DO $$ BEGIN
  CREATE TYPE "TableStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SEATED', 'DIRTY');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Table" ADD COLUMN IF NOT EXISTS "status" "TableStatus" NOT NULL DEFAULT 'AVAILABLE';

-- Reservation.reservation_status
DO $$ BEGIN
  CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'COMPLETED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "reservation_status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE';
