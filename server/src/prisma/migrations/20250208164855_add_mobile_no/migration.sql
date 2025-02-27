/*
  Warnings:

  - A unique constraint covering the columns `[mobile]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobile` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "mobile" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "employee_mobile_key" ON "employee"("mobile");
