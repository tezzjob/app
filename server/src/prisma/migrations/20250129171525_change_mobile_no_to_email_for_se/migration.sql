/*
  Warnings:

  - You are about to drop the column `owner_mobile` on the `shopkeeper` table. All the data in the column will be lost.
  - Added the required column `owner_email` to the `shopkeeper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shopkeeper" DROP COLUMN "owner_mobile",
ADD COLUMN     "owner_email" TEXT NOT NULL;
