-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "detailsBillingAddress" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "shippingCost" DOUBLE PRECISION,
ADD COLUMN     "subotal" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
