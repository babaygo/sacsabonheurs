/*
  Warnings:

  - You are about to drop the column `subotal` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "subotal",
ADD COLUMN     "subtotal" DOUBLE PRECISION;
