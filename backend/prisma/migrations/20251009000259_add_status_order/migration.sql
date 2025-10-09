-- CreateEnum
CREATE TYPE "OrderStatusType" AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatusType" NOT NULL DEFAULT 'pending';
