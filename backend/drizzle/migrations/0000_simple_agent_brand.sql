CREATE TABLE `AuthOtp` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(191) NOT NULL,
	`otp` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `AuthOtp_id` PRIMARY KEY(`id`),
	CONSTRAINT `AuthOtp_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`user_id` int NOT NULL,
	`ui_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`ui_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_ui_idx` UNIQUE(`user_id`,`ui_id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(36) NOT NULL,
	`type` enum('PAYMENT','COMMENT','LIKE','WISHLIST','SYSTEM') NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`userId` int NOT NULL,
	`uiId` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(36) NOT NULL,
	`amount` float NOT NULL,
	`status` enum('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
	`stripePaymentIntentId` varchar(191),
	`userId` int NOT NULL,
	`uiId` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`)
);
--> statement-breakpoint
CREATE TABLE `uis` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`price` varchar(50) NOT NULL,
	`author` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`imageSrc` text NOT NULL,
	`google_file_id` varchar(255),
	`color` varchar(50),
	`tags` json,
	`specifications` json,
	`overview` text,
	`highlights` json,
	`showcase` json,
	`downloads` int NOT NULL DEFAULT 0,
	`likes` int NOT NULL DEFAULT 0,
	`rating` float NOT NULL DEFAULT 4.8,
	`creatorId` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`fileType` varchar(20),
	CONSTRAINT `uis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password_hash` varchar(255),
	`google_id` varchar(191),
	`role` enum('ADMIN','CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
	`status` enum('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_google_id_unique` UNIQUE(`google_id`)
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`ui_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlists_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_wishlist_idx` UNIQUE(`user_id`,`ui_id`)
);
