/*
  Warnings:

  - You are about to drop the `WebHooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WebHooks" DROP CONSTRAINT "WebHooks_companieId_fkey";

-- DropTable
DROP TABLE "WebHooks";
