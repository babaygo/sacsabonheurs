/*
  Warnings:

  - The values [paid] on the enum `OrderStatusType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatusType_new" AS ENUM ('pending', 'shipped', 'delivered', 'cancelled');
ALTER TABLE "public"."Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatusType_new" USING ("status"::text::"OrderStatusType_new");
ALTER TYPE "OrderStatusType" RENAME TO "OrderStatusType_old";
ALTER TYPE "OrderStatusType_new" RENAME TO "OrderStatusType";
DROP TYPE "public"."OrderStatusType_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
