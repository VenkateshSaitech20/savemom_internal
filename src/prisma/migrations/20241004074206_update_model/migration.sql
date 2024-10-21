/*
  Warnings:

  - Added the required column `phoneCode` to the `country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sortname` to the `country` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `country` ADD COLUMN `createdUser` VARCHAR(191) NULL,
    ADD COLUMN `isActive` VARCHAR(191) NOT NULL DEFAULT 'Y',
    ADD COLUMN `isDeleted` VARCHAR(191) NOT NULL DEFAULT 'N',
    ADD COLUMN `phoneCode` VARCHAR(8) NOT NULL,
    ADD COLUMN `sortname` VARCHAR(3) NOT NULL,
    ADD COLUMN `updatedUser` VARCHAR(191) NULL;
