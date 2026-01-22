/*
  Warnings:

  - You are about to drop the column `wasVerifiedByOwner` on the `Withdrawals` table. All the data in the column will be lost.
  - You are about to drop the `WithdrawalVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WithdrawalVerification" DROP CONSTRAINT "WithdrawalVerification_withdrawalId_fkey";

-- AlterTable
ALTER TABLE "Withdrawals" DROP COLUMN "wasVerifiedByOwner";

-- DropTable
DROP TABLE "WithdrawalVerification";
