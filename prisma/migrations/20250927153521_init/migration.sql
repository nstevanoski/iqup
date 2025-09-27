-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `role` ENUM('HQ_ADMIN', 'HQ_STAFF', 'MF_ADMIN', 'MF_STAFF', 'LC_ADMIN', 'LC_STAFF', 'TT_ADMIN', 'TT_STAFF') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `hqId` INTEGER NULL,
    `mfId` INTEGER NULL,
    `lcId` INTEGER NULL,
    `ttId` INTEGER NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExp` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `headquarters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `headquarters_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_franchisees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `hqId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `master_franchisees_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_centers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `mfId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `learning_centers_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher_trainers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `hqId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `teacher_trainers_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'DRAFT',
    `category` VARCHAR(191) NOT NULL,
    `duration` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `maxStudents` INTEGER NOT NULL,
    `currentStudents` INTEGER NOT NULL DEFAULT 0,
    `requirements` JSON NOT NULL,
    `learningObjectives` JSON NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `hours` INTEGER NOT NULL,
    `lessonLength` INTEGER NOT NULL,
    `kind` ENUM('ACADEMIC', 'WORKSHEET', 'BIRTHDAY_PARTY', 'STEM_CAMP', 'VOCATIONAL', 'CERTIFICATION', 'WORKSHOP') NOT NULL,
    `sharedWithMFs` JSON NOT NULL,
    `visibility` ENUM('PRIVATE', 'SHARED', 'PUBLIC') NOT NULL DEFAULT 'PRIVATE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subprograms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `programId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'DRAFT',
    `order` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `prerequisites` JSON NOT NULL,
    `learningObjectives` JSON NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `pricingModel` ENUM('PER_COURSE', 'PER_MONTH', 'PER_SESSION', 'SUBSCRIPTION', 'PROGRAM_PRICE', 'ONE_TIME', 'INSTALLMENTS') NOT NULL,
    `coursePrice` DECIMAL(10, 2) NOT NULL,
    `numberOfPayments` INTEGER NULL,
    `gap` INTEGER NULL,
    `pricePerMonth` DECIMAL(10, 2) NULL,
    `pricePerSession` DECIMAL(10, 2) NULL,
    `sharedWithLCs` JSON NOT NULL,
    `sharedWithMFs` JSON NULL,
    `visibility` ENUM('PRIVATE', 'SHARED', 'PUBLIC') NOT NULL DEFAULT 'PRIVATE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `enrollmentDate` DATETIME(3) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'GRADUATED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `parentFirstName` VARCHAR(191) NOT NULL,
    `parentLastName` VARCHAR(191) NOT NULL,
    `parentPhone` VARCHAR(191) NOT NULL,
    `parentEmail` VARCHAR(191) NOT NULL,
    `emergencyContactEmail` VARCHAR(191) NULL,
    `emergencyContactPhone` VARCHAR(191) NULL,
    `lcId` INTEGER NOT NULL,
    `mfId` INTEGER NOT NULL,
    `hqId` INTEGER NOT NULL,
    `notes` TEXT NULL,
    `avatar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teachers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `experience` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('PROCESS', 'ACTIVE', 'INACTIVE', 'ON_LEAVE') NOT NULL DEFAULT 'PROCESS',
    `bio` TEXT NULL,
    `avatar` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `availability` JSON NULL,
    `education` JSON NULL,
    `trainings` JSON NULL,
    `specialization` JSON NULL,
    `qualifications` JSON NULL,
    `lcId` INTEGER NOT NULL,
    `mfId` INTEGER NOT NULL,
    `hqId` INTEGER NOT NULL,
    `contractFile` VARCHAR(191) NULL,
    `contractDate` DATETIME(3) NULL,
    `contractUploadedBy` INTEGER NULL,
    `contractUploadedAt` DATETIME(3) NULL,
    `approvedBy` INTEGER NULL,
    `approvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `users` ADD CONSTRAINT `users_hqId_fkey` FOREIGN KEY (`hqId`) REFERENCES `headquarters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_mfId_fkey` FOREIGN KEY (`mfId`) REFERENCES `master_franchisees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_lcId_fkey` FOREIGN KEY (`lcId`) REFERENCES `learning_centers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ttId_fkey` FOREIGN KEY (`ttId`) REFERENCES `teacher_trainers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_franchisees` ADD CONSTRAINT `master_franchisees_hqId_fkey` FOREIGN KEY (`hqId`) REFERENCES `headquarters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_centers` ADD CONSTRAINT `learning_centers_mfId_fkey` FOREIGN KEY (`mfId`) REFERENCES `master_franchisees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_trainers` ADD CONSTRAINT `teacher_trainers_hqId_fkey` FOREIGN KEY (`hqId`) REFERENCES `headquarters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `programs` ADD CONSTRAINT `programs_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subprograms` ADD CONSTRAINT `subprograms_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subprograms` ADD CONSTRAINT `subprograms_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_lcId_fkey` FOREIGN KEY (`lcId`) REFERENCES `learning_centers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_mfId_fkey` FOREIGN KEY (`mfId`) REFERENCES `master_franchisees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_hqId_fkey` FOREIGN KEY (`hqId`) REFERENCES `headquarters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_lcId_fkey` FOREIGN KEY (`lcId`) REFERENCES `learning_centers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_mfId_fkey` FOREIGN KEY (`mfId`) REFERENCES `master_franchisees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_hqId_fkey` FOREIGN KEY (`hqId`) REFERENCES `headquarters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
