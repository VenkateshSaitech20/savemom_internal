/*
  Warnings:

  - You are about to alter the column `templateId` on the `sent_emails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `sent_emails` MODIFY `templateId` INTEGER NULL;
