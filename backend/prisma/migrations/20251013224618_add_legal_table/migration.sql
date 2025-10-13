-- CreateTable
CREATE TABLE "Legal" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "mentions" TEXT NOT NULL,
    "cgv" TEXT NOT NULL,
    "privacy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Legal_pkey" PRIMARY KEY ("id")
);
