-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('pending', 'confirmed', 'rejected') NOT NULL DEFAULT 'pending';
