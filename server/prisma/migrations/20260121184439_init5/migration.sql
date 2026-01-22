-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COMPANIE', 'SUPERCOMPANIE');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'FAILED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PAYPAY', 'REFERENCE');

-- CreateEnum
CREATE TYPE "WebhooksScope" AS ENUM ('PAYMENTS', 'WITHDRAWALS', 'ALL');

-- CreateEnum
CREATE TYPE "WebHooksEvents" AS ENUM ('SUCCESS', 'ERROR', 'CREATED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PAYMENT', 'WITHDRAWALS', 'SECURITY', 'OTHERS');

-- CreateEnum
CREATE TYPE "WebHooksMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('PERCENT', 'FIXED', 'IVA', 'NONE');

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "percent" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenants" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'COMPANIE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycValidation" (
    "id" TEXT NOT NULL,
    "companieId" TEXT NOT NULL,
    "documentFrontUrl" TEXT NOT NULL,
    "documentBackUrl" TEXT NOT NULL,
    "bi" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycValidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiSecretKeys" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "companieId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiSecretKeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "companieId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "tax" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "taxType" "TaxType" NOT NULL DEFAULT 'PERCENT',
    "method" "PaymentMethod" NOT NULL DEFAULT 'REFERENCE',
    "currency" TEXT NOT NULL DEFAULT 'AOA',
    "signature" TEXT NOT NULL,
    "entity" TEXT,
    "reference" TEXT,
    "qrCodeUrl" TEXT,
    "paymentUrl" TEXT,
    "callbackUrl" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionItem" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionClientInfo" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionClientInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebHooks" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" JSONB,
    "headers" JSONB,
    "method" "WebHooksMethod" NOT NULL,
    "scope" "WebhooksScope" NOT NULL,
    "events" "WebHooksEvents"[],
    "companieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebHooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "companieId" TEXT NOT NULL,
    "walletHolder" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawals" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "companieId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "tax" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "taxType" "TaxType" NOT NULL DEFAULT 'NONE',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "wasVerifiedByOwner" BOOLEAN NOT NULL DEFAULT false,
    "fileUrl" TEXT,
    "notes" TEXT,
    "approvedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalVerification" (
    "id" TEXT NOT NULL,
    "withdrawalId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WithdrawalVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "companieId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "deeplink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenants_cursor_key" ON "Tenants"("cursor");

-- CreateIndex
CREATE UNIQUE INDEX "Tenants_email_key" ON "Tenants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tenants_phone_key" ON "Tenants"("phone");

-- CreateIndex
CREATE INDEX "Tenants_email_idx" ON "Tenants"("email");

-- CreateIndex
CREATE INDEX "Tenants_phone_idx" ON "Tenants"("phone");

-- CreateIndex
CREATE INDEX "Tenants_isActive_idx" ON "Tenants"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "KycValidation_companieId_key" ON "KycValidation"("companieId");

-- CreateIndex
CREATE UNIQUE INDEX "KycValidation_bi_key" ON "KycValidation"("bi");

-- CreateIndex
CREATE UNIQUE INDEX "ApiSecretKeys_publicKey_key" ON "ApiSecretKeys"("publicKey");

-- CreateIndex
CREATE INDEX "ApiSecretKeys_companieId_idx" ON "ApiSecretKeys"("companieId");

-- CreateIndex
CREATE INDEX "ApiSecretKeys_isActive_idx" ON "ApiSecretKeys"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");

-- CreateIndex
CREATE INDEX "Transaction_companieId_idx" ON "Transaction"("companieId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "TransactionItem_transactionId_idx" ON "TransactionItem"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionClientInfo_transactionId_key" ON "TransactionClientInfo"("transactionId");

-- CreateIndex
CREATE INDEX "WebHooks_companieId_idx" ON "WebHooks"("companieId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_companieId_key" ON "Wallet"("companieId");

-- CreateIndex
CREATE INDEX "Withdrawals_companieId_idx" ON "Withdrawals"("companieId");

-- CreateIndex
CREATE INDEX "Withdrawals_walletId_idx" ON "Withdrawals"("walletId");

-- CreateIndex
CREATE INDEX "Withdrawals_status_idx" ON "Withdrawals"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalVerification_withdrawalId_key" ON "WithdrawalVerification"("withdrawalId");

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalVerification_token_key" ON "WithdrawalVerification"("token");

-- CreateIndex
CREATE INDEX "Notification_companieId_idx" ON "Notification"("companieId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- AddForeignKey
ALTER TABLE "KycValidation" ADD CONSTRAINT "KycValidation_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiSecretKeys" ADD CONSTRAINT "ApiSecretKeys_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionClientInfo" ADD CONSTRAINT "TransactionClientInfo_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebHooks" ADD CONSTRAINT "WebHooks_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawals" ADD CONSTRAINT "Withdrawals_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawals" ADD CONSTRAINT "Withdrawals_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalVerification" ADD CONSTRAINT "WithdrawalVerification_withdrawalId_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "Withdrawals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "Tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
