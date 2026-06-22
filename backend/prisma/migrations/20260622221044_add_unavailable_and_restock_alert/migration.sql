-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "unavailable" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "RestockAlert" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestockAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestockAlert_productId_email_key" ON "RestockAlert"("productId", "email");

-- AddForeignKey
ALTER TABLE "RestockAlert" ADD CONSTRAINT "RestockAlert_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
