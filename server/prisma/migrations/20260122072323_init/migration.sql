/*
  Warnings:

  - The values [ALL] on the enum `WebhooksScope` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WebhooksScope_new" AS ENUM ('PAYMENTS', 'WITHDRAWALS');
ALTER TABLE "WebHooks" ALTER COLUMN "scope" TYPE "WebhooksScope_new" USING ("scope"::text::"WebhooksScope_new");
ALTER TYPE "WebhooksScope" RENAME TO "WebhooksScope_old";
ALTER TYPE "WebhooksScope_new" RENAME TO "WebhooksScope";
DROP TYPE "WebhooksScope_old";
COMMIT;
