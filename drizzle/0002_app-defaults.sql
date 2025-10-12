-- Custom SQL migration file, put your code below! --

-- ========================
-- Table: roles
-- ========================
INSERT INTO roles (id, active, code, name, description, locked) VALUES
(1, 1, 'admin', 'Administrator', 'Has full control over users, settings, and all content within the system.', 1),
(2, 1, 'editor', 'Editor', 'Can create, edit, and manage content but has limited access to system settings.', 1),
(3, 1, 'scheduler', 'Scheduler', 'Can create, and edit user schedules', 1),
(4, 1, 'user', 'User', 'Default account. Limited Access', 1);
--> statement-breakpoint

-- ========================
-- Table: departments
-- ========================
INSERT INTO departments (active, code, name, description, locked) VALUES
(1, 'system', 'System', 'Application Administrators', 1),
(1, 'internal', 'Internal', 'Company Internals', 1),
(1, 'support', 'Support', 'Company Support', 1);
--> statement-breakpoint

-- ========================
-- Table: jobs
-- ========================
INSERT INTO jobs (active, code, name, description, locked) VALUES
(1, 'admin', 'Administrator', 'Administrator', 1),
(1, 'manager', 'Manager', 'Manager', 1),
(1, 'supervisor', 'Supervisor', 'Supervisor', 1),
(1, 'user', 'User', 'User', 1);
--> statement-breakpoint

-- ========================
-- Table: time_events
-- ========================
INSERT INTO time_events (active, code, name, description, locked) VALUES
(1, 'clock', 'Clock', 'Clock working hours', 1),
(1, 'break', 'Short Break', 'Short Breaks', 1),
(1, 'lunch', 'Lunch Break', 'Lunch Break', 1),
(1, 'bio', 'Bio Break', 'Bio Break', 1),
(1, 'coffee', 'Coffee Break', 'Coffee Break', 1),
(1, 'clinic', 'Clinical Leave', 'Clinical Leave', 1),
(1, 'meeting', 'Meeting', 'Meeting', 1);
--> statement-breakpoint

-- ========================
-- Table: resources
-- ========================
INSERT INTO resources (active, code, name, description, locked) VALUES
(1, 'user', 'User', 'Access own info', 1),
(1, 'profile', 'Profile', 'Access Profile Page', 1),
(1, 'entries', 'Entries', 'Access time entries', 1),
(1, 'timesheets', 'Timesheets', 'View timesheets', 1),
(1, 'admin.users', 'Users', 'Access list of users', 1),
(1, 'timesheets_report', 'Timesheets Report', 'View others timesheets', 1),
(1, 'settings', 'Settings', 'Access App settings', 1),
(1, 'settings.options', 'Options', 'Access application options', 1),
(1, 'settings.permissions', 'Permissions Config', 'Access role_permissions', 1),
(1, 'departments', 'Departments', 'Access departments options', 1),
(1, 'jobs', 'Jobs', 'Access jobs options', 1),
(1, 'time_events', 'Time Events', 'Access time events options', 1),
(1, 'roles', 'Roles', 'Access user roles options', 1),
(1, 'role_permissions', 'Role Permissions', 'Permissions for application roles', 1),
(1, 'admin.register', 'Register', 'Add User', 1),
(1, 'admin.templates', 'Schedule Templates', 'Schedule Templates', 1),
(1, 'admin.schedules', 'User Schedules', 'User Schedules', 1),
(1, 'admin.logs', 'Table Logs', 'Table Logs',1);
--> statement-breakpoint

-- ========================
-- Table: users
-- ========================
INSERT INTO users (id, name, role_id, password_hash) VALUES
(100000, 'Super Admin', 1, '$argon2id$v=19$m=4096,t=3,p=1$CRBu7CMkaQBxJXkpqWjDAg$Saih8OxuU6k62uhrLHv8C2y/3+88L3XRWBkZE59r1X4');
--> statement-breakpoint

-- ========================
-- Table: role_permissions
-- ========================
INSERT INTO role_permissions (role_id, resource_id, can_create, can_read, can_update, can_delete, locked) VALUES
(1, 1, 1, 1, 1, 1, 1),
(1, 2, 1, 1, 1, 1, 1),
(1, 3, 1, 1, 1, 1, 1),
(1, 4, 1, 1, 1, 1, 1),
(1, 5, 1, 1, 1, 1, 1),
(1, 6, 1, 1, 1, 1, 1),
(1, 7, 1, 1, 1, 1, 1),
(1, 8, 1, 1, 1, 1, 1),
(1, 9, 1, 1, 1, 1, 1),
(1, 10, 1, 1, 1, 1, 1),
(1, 11, 1, 1, 1, 1, 1),
(1, 12, 1, 1, 1, 1, 1),
(1, 13, 1, 1, 1, 1, 1),
(1, 14, 1, 1, 1, 1, 1),
(1, 15, 1, 1, 1, 0, 1),
(1, 16, 1, 1, 1, 1, 1),
(1, 17, 1, 1, 1, 1, 1),
(1, 18, 1, 0, 0, 0, 1),
(2, 1, 1, 1, 1, 1, 1),
(2, 2, 1, 1, 1, 1, 1),
(2, 3, 1, 1, 1, 1, 1),
(2, 4, 1, 1, 1, 1, 1),
(2, 5, 1, 1, 1, 1, 1),
(2, 6, 1, 1, 1, 1, 1),
(2, 7, 1, 1, 1, 1, 1),
(2, 8, 1, 1, 1, 1, 1),
(2, 10, 1, 1, 1, 0, 1),
(2, 11, 1, 1, 1, 0, 1),
(2, 12, 1, 1, 1, 0, 1),
(2, 13, 1, 1, 1, 1, 1),
(2, 15, 1, 1, 1, 0, 1),
(2, 16, 1, 1, 1, 1, 1),
(2, 17, 1, 1, 1, 1, 1),
(2, 18, 1, 0, 0, 0, 1),
(3, 1, 1, 1, 0, 0, 1),
(3, 2, 1, 1, 0, 0, 1),
(3, 3, 1, 1, 0, 0, 1),
(3, 4, 1, 1, 0, 0, 1),
(3, 5, 0, 1, 0, 0, 1),
(3, 6, 0, 1, 0, 0, 1),
(3, 16, 1, 1, 1, 0, 1),
(3, 17, 1, 1, 1, 0, 1),
(4, 1, 1, 1, 1, 0, 1),
(4, 2, 1, 1, 1, 0, 1),
(4, 3, 1, 1, 1, 0, 1),
(4, 4, 1, 1, 1, 0, 1);
