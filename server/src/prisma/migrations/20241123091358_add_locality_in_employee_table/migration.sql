/*
  Warnings:

  - Added the required column `locality` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "locality" TEXT NOT NULL;
