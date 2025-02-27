/*
  Warnings:

  - A unique constraint covering the columns `[username,mobile]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "employee_username_mobile_key" ON "employee"("username", "mobile");
