-- CreateTable
CREATE TABLE `21_phone_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NULL,
    `url` CHAR(255) NULL,
    `time` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted` BOOLEAN NULL DEFAULT false,

    INDEX `21_phone_image_playerId_IDX`(`playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
