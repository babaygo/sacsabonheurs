-- CreateEnum
CREATE TYPE "BannerVariant" AS ENUM ('info', 'warning', 'primary');

-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "variant" "BannerVariant" NOT NULL DEFAULT 'primary',
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "dismissible" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);
