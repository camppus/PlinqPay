/*
  Warnings:

  - A unique constraint covering the columns `[entitieId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification_entitieId_key" ON "Notification"("entitieId");
