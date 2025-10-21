/*
  Warnings:

  - You are about to drop the column `hiden` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "hiden",
ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;
