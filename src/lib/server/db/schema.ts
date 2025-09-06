import type { ScheduleTemplates, UserPreferences, UserTimeEventSchedules } from "$lib/app-types"
import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, primaryKey, foreignKey, index, type AnySQLiteColumn, unique } from "drizzle-orm/sqlite-core";

export const tblTimeEvents = sqliteTable("time_events", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).default(true).notNull(),
  code: text().unique().notNull(),
  name: text().unique().notNull(),
  description: text(),
  locked: integer({ mode: "boolean" }).default(false).notNull()
}, (table) =>
  [index("time_events_active_idx").on(table.active)]
);

export const tblDepartments = sqliteTable("departments", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).default(true).notNull(),
  code: text().unique().notNull(),
  name: text().unique().notNull(),
  description: text(),
  locked: integer({ mode: "boolean" }).default(false).notNull()
}, (table) => [
  index("departments_active_idx").on(table.active)
]);

export const tblJobs = sqliteTable("jobs", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).default(true).notNull(),
  code: text().unique().notNull(),
  name: text().unique().notNull(),
  description: text(),
  locked: integer({ mode: "boolean" }).default(false).notNull()
}, (table) => [
  index("jobs_active_idx").on(table.active)
]);

export const tblRoles = sqliteTable("roles", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).default(true).notNull(),
  code: text().unique().notNull(),
  name: text().unique().notNull(),
  description: text(),
  locked: integer({ mode: "boolean" }).default(false).notNull()
}, (table) => [
  index("roles_active_idx").on(table.active)
]);

export const tblResources = sqliteTable("resources", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).default(true).notNull(),
  code: text().unique().notNull(),
  name: text().unique().notNull(),
  description: text(),
  locked: integer({ mode: "boolean" }).default(true).notNull()
}, (table) => [
  index("resources_active_idx").on(table.active)
]);

export const tblRolePermissions = sqliteTable("role_permissions", {
  roleId: integer().references(() => tblRoles.id, { onDelete: "cascade" }).notNull(),
  resourceId: integer().references(() => tblResources.id, { onDelete: "cascade" }).notNull(),
  canCreate: integer({ mode: "boolean" }).default(false).notNull(),
  canRead: integer({ mode: "boolean" }).default(false).notNull(),
  canUpdate: integer({ mode: "boolean" }).default(false).notNull(),
  canDelete: integer({ mode: "boolean" }).default(false).notNull(),
  locked: integer({ mode: "boolean" }).default(false).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.roleId, table.resourceId] }),
    index("role_permissions_role_id_idx").on(table.roleId)
  ]
);

export const tblUsers = sqliteTable("users", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).notNull().default(true),
  name: text().notNull(),
  roleId: integer().notNull().references(() => tblRoles.id, { onDelete: "cascade" }),
  passwordHash: text().notNull(),
  supervisorId: integer().references((): AnySQLiteColumn => tblUsers.id, { onDelete: "set null" }),
  lockPassword: integer({ mode: "boolean" }).notNull().default(false),
  preferences: text({ mode: "json" }).notNull().default('{"background": null, "avatar": null, "mode": "light"}').$type<UserPreferences>(),
  createdAt: text().notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text().notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("users_active_idx").on(table.active),
  index("users_role_id_idx").on(table.roleId),
  index("users_supervisor_id_idx").on(table.supervisorId)
]);

export const tblUserDesignation = sqliteTable("user_designations", {
  id: integer().primaryKey(),
  userId: integer().references(() => tblUsers.id, { onDelete: "cascade" }),
  active: integer({ mode: "boolean" }).default(true).notNull(),
  departmentId: integer().references(() => tblDepartments.id),
  jobId: integer().references(() => tblJobs.id),
  createdAt: text().default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  unique().on(table.userId, table.departmentId),
  index("user_designations_user_active_idx").on(table.userId, table.active),
  index("user_designation_user_dept_idx").on(table.departmentId, table.active),
  index("user_designation_user_job_idx").on(table.jobId, table.active)
]);

export const tblSessions = sqliteTable("sessions", {
  id: text().primaryKey(),
  userId: integer().references(() => tblUsers.id, { onDelete: "cascade" }),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
}, (table) => [
  index("sessions_user_idx").on(table.userId)
]);

export const tblUserSchedule = sqliteTable("user_schedules", {
  id: integer().primaryKey(),
  userId: integer().references(() => tblUsers.id, { onDelete: "cascade" }),
  startDate: text().default(sql`CURRENT_DATE`).notNull(),
  userTimezone: text().default('Asia/Manila').notNull(),
  clientTimezone: text().default('Asia/Manila').notNull(),
  clockIn: text().default('00:00').notNull(),
  clockOut: text().default('09:00').notNull(),
  description: text(),
  events: text({ mode: "json" }).notNull().default('[]').$type<UserTimeEventSchedules[]>(),
},
  (table) => [
    index("schedules_user_date_idx").on(table.userId, table.startDate)
  ]
);

export const tblTemplates = sqliteTable("templates", {
  id: integer().primaryKey(),
  departmentId: integer().references(() => tblDepartments.id, { onDelete: "cascade" }),
  jobId: integer().references(() => tblJobs.id, { onDelete: "cascade" }),
  name: text().notNull(),
  description: text(),
  template: text({ mode: 'json' }).notNull().$type<ScheduleTemplates>(),
  createdAt: text().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
  (table) => [
    unique().on(table.departmentId, table.jobId, table.name),
    index("templates_department_idx").on(table.departmentId),
    index("templates_job_idx").on(table.jobId),
  ]
)