/*
  Warnings:

  - You are about to drop the column `isEmailVerfied` on the `Tenants` table. All the data in the column will be lost.
  - You are about to drop the column `isProfileVeried` on the `Tenants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tenants" DROP COLUMN "isEmailVerfied",
DROP COLUMN "isProfileVeried",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
