/*
  Warnings:

  - Added the required column `entitieId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "entitieId" TEXT NOT NULL;
