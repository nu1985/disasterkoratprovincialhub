-- CreateTable
CREATE TABLE `incidents` (
    `id` VARCHAR(191) NOT NULL,
    `external_reference_code` VARCHAR(191) NULL,
    `title` TEXT NOT NULL,
    `description` TEXT NULL,
    `incident_type_id` VARCHAR(191) NOT NULL,
    `severity` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'LOW',
    `status` ENUM('NEW', 'VALIDATING', 'ASSIGNED', 'IN_PROGRESS', 'DONE', 'INVALID', 'DUPLICATE') NOT NULL DEFAULT 'NEW',
    `reported_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `occurred_at` DATETIME(3) NULL,
    `location_id` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `reporter_id` VARCHAR(191) NULL,
    `source_channel_id` VARCHAR(191) NULL,
    `created_by_user_id` VARCHAR(191) NULL,
    `sync_key` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `incidents_sync_key_key`(`sync_key`),
    INDEX `incidents_incident_type_id_idx`(`incident_type_id`),
    INDEX `incidents_location_id_idx`(`location_id`),
    INDEX `incidents_reporter_id_idx`(`reporter_id`),
    INDEX `incidents_source_channel_id_idx`(`source_channel_id`),
    INDEX `incidents_created_by_user_id_idx`(`created_by_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `incident_types` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name_th` VARCHAR(191) NOT NULL,
    `name_en` VARCHAR(191) NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `incident_types_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `subdistrict` VARCHAR(191) NOT NULL,
    `address_text` TEXT NULL,
    `postal_code` VARCHAR(191) NULL,
    `geocode` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporters` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `line_id` VARCHAR(191) NULL,
    `facebook_id` VARCHAR(191) NULL,
    `preferred_channel` VARCHAR(191) NULL,
    `is_anonymous` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organizations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `parent_org_id` VARCHAR(191) NULL,
    `contact_phone` VARCHAR(191) NULL,
    `contact_address` TEXT NULL,

    INDEX `organizations_parent_org_id_idx`(`parent_org_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `units` (
    `id` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `unit_type` VARCHAR(191) NULL,
    `contact_channel` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `units_organization_id_idx`(`organization_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `password_hash` VARCHAR(191) NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_login_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    INDEX `users_role_id_idx`(`role_id`),
    INDEX `users_organization_id_idx`(`organization_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `incident_status_history` (
    `id` VARCHAR(191) NOT NULL,
    `incident_id` VARCHAR(191) NOT NULL,
    `old_status` ENUM('NEW', 'VALIDATING', 'ASSIGNED', 'IN_PROGRESS', 'DONE', 'INVALID', 'DUPLICATE') NULL,
    `new_status` ENUM('NEW', 'VALIDATING', 'ASSIGNED', 'IN_PROGRESS', 'DONE', 'INVALID', 'DUPLICATE') NOT NULL,
    `changed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `changed_by_user_id` VARCHAR(191) NULL,
    `note` TEXT NULL,

    INDEX `incident_status_history_incident_id_idx`(`incident_id`),
    INDEX `incident_status_history_changed_by_user_id_idx`(`changed_by_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignments` (
    `id` VARCHAR(191) NOT NULL,
    `incident_id` VARCHAR(191) NOT NULL,
    `unit_id` VARCHAR(191) NOT NULL,
    `assigned_by_user_id` VARCHAR(191) NULL,
    `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `accepted_at` DATETIME(3) NULL,
    `completed_at` DATETIME(3) NULL,
    `status` ENUM('ASSIGNED', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'ASSIGNED',
    `note` TEXT NULL,

    INDEX `assignments_incident_id_idx`(`incident_id`),
    INDEX `assignments_unit_id_idx`(`unit_id`),
    INDEX `assignments_assigned_by_user_id_idx`(`assigned_by_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resources` (
    `id` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `resource_type` VARCHAR(191) NOT NULL,
    `capacity` DOUBLE NULL,
    `status` ENUM('AVAILABLE', 'IN_USE', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    `location_id` VARCHAR(191) NULL,

    INDEX `resources_organization_id_idx`(`organization_id`),
    INDEX `resources_location_id_idx`(`location_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignment_resources` (
    `id` VARCHAR(191) NOT NULL,
    `assignment_id` VARCHAR(191) NOT NULL,
    `resource_id` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NOT NULL,

    INDEX `assignment_resources_assignment_id_idx`(`assignment_id`),
    INDEX `assignment_resources_resource_id_idx`(`resource_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachments` (
    `id` VARCHAR(191) NOT NULL,
    `incident_id` VARCHAR(191) NOT NULL,
    `assignment_id` VARCHAR(191) NULL,
    `file_url` TEXT NOT NULL,
    `file_type` VARCHAR(191) NOT NULL,
    `uploaded_by_user_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `attachments_incident_id_idx`(`incident_id`),
    INDEX `attachments_assignment_id_idx`(`assignment_id`),
    INDEX `attachments_uploaded_by_user_id_idx`(`uploaded_by_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `channels` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `config_json` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sync_endpoints` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `direction` ENUM('INBOUND', 'OUTBOUND') NOT NULL,
    `url` TEXT NOT NULL,
    `auth_type` VARCHAR(191) NULL,
    `config_json` JSON NULL,
    `last_sync_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sync_events` (
    `id` VARCHAR(191) NOT NULL,
    `sync_endpoint_id` VARCHAR(191) NOT NULL,
    `incident_id` VARCHAR(191) NOT NULL,
    `event_type` VARCHAR(191) NOT NULL,
    `payload_json` JSON NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `last_error` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sync_events_sync_endpoint_id_idx`(`sync_endpoint_id`),
    INDEX `sync_events_incident_id_idx`(`incident_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_incident_type_id_fkey` FOREIGN KEY (`incident_type_id`) REFERENCES `incident_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_reporter_id_fkey` FOREIGN KEY (`reporter_id`) REFERENCES `reporters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_source_channel_id_fkey` FOREIGN KEY (`source_channel_id`) REFERENCES `channels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_parent_org_id_fkey` FOREIGN KEY (`parent_org_id`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `units` ADD CONSTRAINT `units_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident_status_history` ADD CONSTRAINT `incident_status_history_incident_id_fkey` FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident_status_history` ADD CONSTRAINT `incident_status_history_changed_by_user_id_fkey` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_incident_id_fkey` FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_assigned_by_user_id_fkey` FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resources` ADD CONSTRAINT `resources_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resources` ADD CONSTRAINT `resources_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignment_resources` ADD CONSTRAINT `assignment_resources_assignment_id_fkey` FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignment_resources` ADD CONSTRAINT `assignment_resources_resource_id_fkey` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attachments` ADD CONSTRAINT `attachments_incident_id_fkey` FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attachments` ADD CONSTRAINT `attachments_assignment_id_fkey` FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attachments` ADD CONSTRAINT `attachments_uploaded_by_user_id_fkey` FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sync_events` ADD CONSTRAINT `sync_events_sync_endpoint_id_fkey` FOREIGN KEY (`sync_endpoint_id`) REFERENCES `sync_endpoints`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sync_events` ADD CONSTRAINT `sync_events_incident_id_fkey` FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

