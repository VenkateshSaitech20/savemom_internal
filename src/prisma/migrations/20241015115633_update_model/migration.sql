-- CreateTable
CREATE TABLE `contents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NULL,
    `categoryName` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `shortContent` VARCHAR(300) NULL,
    `content` VARCHAR(3000) NULL,
    `isDeleted` VARCHAR(191) NULL DEFAULT 'N',
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
