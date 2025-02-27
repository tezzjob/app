/*
  Warnings:

  - You are about to drop the column `mobile` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `employee` table. All the data in the column will be lost.
  - The `locality` column on the `employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "employee_mobile_key";

-- DropIndex
DROP INDEX "employee_username_key";

-- DropIndex
DROP INDEX "employee_username_mobile_key";

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "mobile",
DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL,
DROP COLUMN "locality",
ADD COLUMN     "locality" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");
