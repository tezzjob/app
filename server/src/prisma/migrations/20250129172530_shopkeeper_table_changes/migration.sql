/*
  Warnings:

  - A unique constraint covering the columns `[owner_email,unique_shop_name]` on the table `shopkeeper` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `shopkeeper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unique_shop_name` to the `shopkeeper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shopkeeper" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "unique_shop_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shopkeeper_owner_email_unique_shop_name_key" ON "shopkeeper"("owner_email", "unique_shop_name");
