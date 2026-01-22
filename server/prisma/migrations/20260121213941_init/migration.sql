/*
  Warnings:

  - Added the required column `externId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `getawayIdentifier` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "externId" TEXT NOT NULL,
ADD COLUMN     "getawayIdentifier" TEXT NOT NULL;
