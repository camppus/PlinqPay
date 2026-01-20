/*
  Warnings:

  - You are about to drop the `Companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApiSecretKeys" DROP CONSTRAINT "ApiSecretKeys_companieID_fkey";

-- DropForeignKey
ALTER TABLE "EmailVerification" DROP CONSTRAINT "EmailVerification_companieID_fkey";

-- DropForeignKey
ALTER TABLE "KycValidation" DROP CONSTRAINT "KycValidation_companieID_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_companieId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_companieID_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_companieID_fkey";

-- DropForeignKey
ALTER TABLE "WebHooks" DROP CONSTRAINT "WebHooks_companieID_fkey";

-- DropForeignKey
ALTER TABLE "Withdrawls" DROP CONSTRAINT "Withdrawls_companieId_fkey";

-- DropTable
DROP TABLE "Companies";

-- DropTable
DROP TABLE "EmailVerification";

-- CreateTable
CREATE TABLE "Tenants" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'COMPANIE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isProfileVeried" BOOLEAN NOT NULL DEFAULT false,
    "isEmailVerfied" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tenants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenants_cursor_key" ON "Tenants"("cursor");

-- CreateIndex
CREATE UNIQUE INDEX "Tenants_email_key" ON "Tenants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tenants_phone_key" ON "Tenants"("phone");

-- AddForeignKey
ALTER TABLE "KycValidation" ADD CONSTRAINT "KycValidation_companieID_fkey" FOREIGN KEY ("companieID") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiSecretKeys" ADD CONSTRAINT "ApiSecretKeys_companieID_fkey" FOREIGN KEY ("companieID") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_companieID_fkey" FOREIGN KEY ("companieID") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebHooks" ADD CONSTRAINT "WebHooks_companieID_fkey" FOREIGN KEY ("companieID") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_companieID_fkey" FOREIGN KEY ("companieID") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawls" ADD CONSTRAINT "Withdrawls_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
