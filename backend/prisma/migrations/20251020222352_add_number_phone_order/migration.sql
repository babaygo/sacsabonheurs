/*
  Warnings:

  - You are about to drop the column `phone` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "phone";
