/*
  Warnings:

  - You are about to drop the column `tax` on the `Withdrawals` table. All the data in the column will be lost.
  - You are about to drop the column `taxType` on the `Withdrawals` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Withdrawals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Withdrawals" DROP COLUMN "tax",
DROP COLUMN "taxType",
DROP COLUMN "total";
