-- CreateTable
CREATE TABLE `learning_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `maxStudents` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `schedule` JSON NOT NULL,
    `pricingSnapshot` JSON NOT NULL,
    `programId` INTEGER NOT NULL,
    `subProgramId` INTEGER NULL,
    `lcId` INTEGER NOT NULL,
    `mfId` INTEGER NOT NULL,
    `hqId` INTEGER NOT NULL,
    `teacherId` INTEGER NOT NULL,
    `students` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `learning_groups` ADD CONSTRAINT `learning_groups_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `programs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_groups` ADD CONSTRAINT `learning_groups_subProgramId_fkey` FOREIGN KEY (`subProgramId`) REFERENCES `subprograms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_groups` ADD CONSTRAINT `learning_groups_lcId_fkey` FOREIGN KEY (`lcId`) REFERENCES `learning_centers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_groups` ADD CONSTRAINT `learning_groups_mfId_fkey` FOREIGN KEY (`mfId`) REFERENCES `master_franchisees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_groups` ADD CONSTRAINT `learning_groups_hqId_fkey` FOREIGN KEY (`hqId`) REFERENCES `headquarters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_groups` ADD CONSTRAINT `learning_groups_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
