/*
  Warnings:

  - You are about to drop the column `createdUser` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedUser` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `categories` DROP COLUMN `createdUser`,
    DROP COLUMN `updatedUser`,
    ADD COLUMN `createdBy` VARCHAR(191) NULL,
    ADD COLUMN `updatedBy` VARCHAR(191) NULL;
