/*
  Warnings:

  - You are about to drop the `shopkeeper` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "shopkeeper";

-- CreateTable
CREATE TABLE "shop" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "shop_name" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "shop_location" TEXT NOT NULL,
    "owner_email" TEXT NOT NULL,
    "owner_mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_email_validated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "shop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shop_owner_email_key" ON "shop"("owner_email");

-- CreateIndex
CREATE UNIQUE INDEX "shop_owner_mobile_key" ON "shop"("owner_mobile");
