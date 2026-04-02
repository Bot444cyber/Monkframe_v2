CREATE TABLE `newsletter_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscribers_email_unique` UNIQUE(`email`)
);
