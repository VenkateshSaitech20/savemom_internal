/*
  Warnings:

  - You are about to drop the column `sortname` on the `country` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPlan` on the `user` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `city` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortname` to the `country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `district` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `city` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdUser` VARCHAR(191) NULL,
    ADD COLUMN `isActive` VARCHAR(191) NOT NULL DEFAULT 'Y',
    ADD COLUMN `isDeleted` VARCHAR(191) NOT NULL DEFAULT 'N',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedUser` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `country` DROP COLUMN `sortname`,
    ADD COLUMN `shortname` VARCHAR(3) NOT NULL;

-- AlterTable
ALTER TABLE `district` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdUser` VARCHAR(191) NULL,
    ADD COLUMN `isActive` VARCHAR(191) NOT NULL DEFAULT 'Y',
    ADD COLUMN `isDeleted` VARCHAR(191) NOT NULL DEFAULT 'N',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedUser` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `state` ADD COLUMN `createdUser` VARCHAR(191) NULL,
    ADD COLUMN `isActive` VARCHAR(191) NOT NULL DEFAULT 'Y',
    ADD COLUMN `isDeleted` VARCHAR(191) NOT NULL DEFAULT 'N',
    ADD COLUMN `updatedUser` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `subscriptionPlan`,
    ADD COLUMN `amount` VARCHAR(191) NULL,
    ADD COLUMN `countryId` INTEGER NULL,
    ADD COLUMN `currency` VARCHAR(191) NULL,
    ADD COLUMN `expirayDate` DATETIME(3) NULL,
    ADD COLUMN `isExpired` VARCHAR(191) NULL,
    ADD COLUMN `packageId` VARCHAR(191) NULL,
    ADD COLUMN `packageName` VARCHAR(191) NULL,
    ADD COLUMN `packageValidity` VARCHAR(191) NULL,
    ADD COLUMN `paymentId` VARCHAR(191) NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NULL,
    ADD COLUMN `paymentStatus` VARCHAR(191) NULL,
    ADD COLUMN `phoneCode` VARCHAR(8) NULL,
    ADD COLUMN `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `stateId` INTEGER NULL;

-- CreateTable
CREATE TABLE `subscription_list` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `contactNo` VARCHAR(191) NULL,
    `packageId` VARCHAR(191) NULL,
    `packageName` VARCHAR(191) NULL,
    `packageValidity` VARCHAR(191) NULL,
    `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expirayDate` DATETIME(3) NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `isExpired` VARCHAR(191) NULL,
    `amount` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NULL,
    `paymentStatus` VARCHAR(191) NULL,
    `paymentId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
