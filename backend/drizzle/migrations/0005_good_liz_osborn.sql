ALTER TABLE `uis` ADD `slug` varchar(255);
ALTER TABLE `uis` ADD CONSTRAINT `uis_slug_unique` UNIQUE(`slug`);