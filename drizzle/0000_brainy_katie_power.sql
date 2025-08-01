CREATE TABLE `departments` (
	`id` integer PRIMARY KEY NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`locked` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `departments_code_unique` ON `departments` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `departments_name_unique` ON `departments` (`name`);--> statement-breakpoint
CREATE INDEX `departments_active_idx` ON `departments` (`active`);--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`locked` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_code_unique` ON `jobs` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_name_unique` ON `jobs` (`name`);--> statement-breakpoint
CREATE INDEX `jobs_active_idx` ON `jobs` (`active`);--> statement-breakpoint
CREATE TABLE `resources` (
	`id` integer PRIMARY KEY NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`locked` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resources_code_unique` ON `resources` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `resources_name_unique` ON `resources` (`name`);--> statement-breakpoint
CREATE INDEX `resources_active_idx` ON `resources` (`active`);--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` integer NOT NULL,
	`resource_id` integer NOT NULL,
	`can_create` integer DEFAULT false NOT NULL,
	`can_read` integer DEFAULT false NOT NULL,
	`can_update` integer DEFAULT false NOT NULL,
	`can_delete` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`role_id`, `resource_id`),
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `role_permissions_role_id_idx` ON `role_permissions` (`role_id`);--> statement-breakpoint
CREATE TABLE `roles` (
	`id` integer PRIMARY KEY NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`locked` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_code_unique` ON `roles` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `roles_name_unique` ON `roles` (`name`);--> statement-breakpoint
CREATE INDEX `roles_active_idx` ON `roles` (`active`);--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`start_date` text DEFAULT CURRENT_DATE NOT NULL,
	`user_timezone` text DEFAULT 'Asia/Manila' NOT NULL,
	`client_timezone` text DEFAULT 'Asia/Manila' NOT NULL,
	`time_event_id` integer,
	`start_time` text DEFAULT '00:00' NOT NULL,
	`end_time` text DEFAULT '00:00' NOT NULL,
	`description` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`time_event_id`) REFERENCES `time_events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `schedules_user_date_idx` ON `schedules` (`user_id`,`start_date`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `time_events` (
	`id` integer PRIMARY KEY NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`locked` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `time_events_code_unique` ON `time_events` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `time_events_name_unique` ON `time_events` (`name`);--> statement-breakpoint
CREATE INDEX `time_events_active_idx` ON `time_events` (`active`);--> statement-breakpoint
CREATE TABLE `user_designations` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`active` integer DEFAULT true NOT NULL,
	`department_id` integer,
	`job_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `user_designations_user_active_idx` ON `user_designations` (`user_id`,`active`);--> statement-breakpoint
CREATE INDEX `user_designation_user_dept_idx` ON `user_designations` (`department_id`,`active`);--> statement-breakpoint
CREATE INDEX `user_designation_user_job_idx` ON `user_designations` (`job_id`,`active`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_designations_userId_departmentId_jobId_unique` ON `user_designations` (`user_id`,`department_id`,`job_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`name` text NOT NULL,
	`role_id` integer NOT NULL,
	`password_hash` text NOT NULL,
	`supervisor_id` integer,
	`lock_password` integer DEFAULT false NOT NULL,
	`preferences` text DEFAULT '{"background": null, "avatar": null, "mode": "light"}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supervisor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `users_active_idx` ON `users` (`active`);--> statement-breakpoint
CREATE INDEX `users_role_id_idx` ON `users` (`role_id`);--> statement-breakpoint
CREATE INDEX `users_supervisor_id_idx` ON `users` (`supervisor_id`);