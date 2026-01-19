-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COMPANIE', 'SUPERCOMPANIE');

-- CreateEnum
CREATE TYPE "VeriicationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'FAILD', 'APROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PAYPAY', 'REFERENCE');

-- CreateEnum
CREATE TYPE "WebhooksScope" AS ENUM ('PAYMENTS', 'WITHDRWALS', 'ALL');

-- CreateEnum
CREATE TYPE "WebHooksEvents" AS ENUM ('SUCESS', 'ERROR', 'CREATED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PAYMENT', 'WITHDRWALS', 'SECURITY', 'OTHERS');

-- CreateEnum
CREATE TYPE "WebHooksMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('PERCENT', 'FIXED', 'IVA', 'NONE');

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "percent" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Companies" (
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

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerification" (
    "id" TEXT NOT NULL,
    "companieID" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "verfiedAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "status" "VeriicationStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "EmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycValidation" (
    "id" TEXT NOT NULL,
    "companieID" TEXT NOT NULL,
    "documentFrontalUrl" TEXT NOT NULL,
    "documentBackUrl" TEXT NOT NULL,
    "bi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "verfiedAt" TIMESTAMP(3) NOT NULL,
    "status" "VeriicationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "KycValidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiSecretKeys" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "companieID" TEXT NOT NULL,
    "callbackURl" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "ips" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "verfiedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ApiSecretKeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "companieID" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PAID',
    "ammount" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "tax" INTEGER NOT NULL,
    "taxtype" "TaxType" NOT NULL DEFAULT 'PERCENT',
    "method" "PaymentMethod" NOT NULL DEFAULT 'REFERENCE',
    "currency" TEXT NOT NULL DEFAULT 'AOA',
    "clientEmail" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "entitie" TEXT,
    "reference" TEXT,
    "qrdCodeUrl" TEXT,
    "paymentUrl" TEXT,
    "wasCreationWebhookCalled" BOOLEAN NOT NULL DEFAULT false,
    "wasSucessWebeHookCalled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactiontItem" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "qtd" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactiontItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionClientInfo" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companieID" TEXT NOT NULL,

    CONSTRAINT "WebHooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "companieID" TEXT NOT NULL,
    "walletHolder" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawls" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "companieId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "tax" INTEGER NOT NULL,
    "taxtype" "TaxType" NOT NULL DEFAULT 'NONE',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "wasVerifiedByOwner" BOOLEAN NOT NULL DEFAULT false,
    "fileUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aprovedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "Withdrawls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawlsVerification" (
    "id" TEXT NOT NULL,
    "withdrallId" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WithdrawlsVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "companieId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deeplink" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Companies_email_key" ON "Companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Companies_phone_key" ON "Companies"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerification_companieID_key" ON "EmailVerification"("companieID");

-- CreateIndex
CREATE UNIQUE INDEX "KycValidation_companieID_key" ON "KycValidation"("companieID");

-- CreateIndex
CREATE UNIQUE INDEX "KycValidation_bi_key" ON "KycValidation"("bi");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_companieID_key" ON "Wallet"("companieID");

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawlsVerification_withdrallId_key" ON "WithdrawlsVerification"("withdrallId");

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawlsVerification_token_key" ON "WithdrawlsVerification"("token");

-- AddForeignKey
ALTER TABLE "EmailVerification" ADD CONSTRAINT "EmailVerification_companieID_fkey" FOREIGN KEY ("companieID") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycValidation" ADD CONSTRAINT "KycValidation_companieID_fkey" FOREIGN KEY ("companieID") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiSecretKeys" ADD CONSTRAINT "ApiSecretKeys_companieID_fkey" FOREIGN KEY ("companieID") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_companieID_fkey" FOREIGN KEY ("companieID") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactiontItem" ADD CONSTRAINT "TransactiontItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionClientInfo" ADD CONSTRAINT "TransactionClientInfo_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebHooks" ADD CONSTRAINT "WebHooks_companieID_fkey" FOREIGN KEY ("companieID") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_companieID_fkey" FOREIGN KEY ("companieID") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawls" ADD CONSTRAINT "Withdrawls_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawls" ADD CONSTRAINT "Withdrawls_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawlsVerification" ADD CONSTRAINT "WithdrawlsVerification_withdrallId_fkey" FOREIGN KEY ("withdrallId") REFERENCES "Withdrawls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_companieId_fkey" FOREIGN KEY ("companieId") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
