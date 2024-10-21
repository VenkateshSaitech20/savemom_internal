/*
  Warnings:

  - You are about to drop the column `password` on the `sms_setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sms_setting` DROP COLUMN `password`,
    ADD COLUMN `authKey` VARCHAR(191) NULL,
    ADD COLUMN `publicKey` VARCHAR(191) NULL;
