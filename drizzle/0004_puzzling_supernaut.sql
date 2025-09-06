CREATE TABLE `templates` (
	`id` integer PRIMARY KEY NOT NULL,
	`department_id` integer,
	`job_id` integer,
	`name` text NOT NULL,
	`description` text,
	`template` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `templates_department_idx` ON `templates` (`department_id`);--> statement-breakpoint
CREATE INDEX `templates_job_idx` ON `templates` (`job_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `templates_departmentId_jobId_name_unique` ON `templates` (`department_id`,`job_id`,`name`);--> statement-breakpoint
CREATE TABLE `user_schedules` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`start_date` text DEFAULT CURRENT_DATE NOT NULL,
	`user_timezone` text DEFAULT 'Asia/Manila' NOT NULL,
	`client_timezone` text DEFAULT 'Asia/Manila' NOT NULL,
	`clock_in` text DEFAULT '00:00' NOT NULL,
	`clock_out` text DEFAULT '09:00' NOT NULL,
	`description` text,
	`events` text DEFAULT '[]' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `schedules_user_date_idx` ON `user_schedules` (`user_id`,`start_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_designations_userId_departmentId_unique` ON `user_designations` (`user_id`,`department_id`);