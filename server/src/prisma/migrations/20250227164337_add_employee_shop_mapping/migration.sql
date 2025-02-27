/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `shop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "employee_shop_mapping" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "shop_id" INTEGER NOT NULL,

    CONSTRAINT "employee_shop_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_shop_mapping_employee_id_shop_id_key" ON "employee_shop_mapping"("employee_id", "shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "shop_uuid_key" ON "shop"("uuid");
