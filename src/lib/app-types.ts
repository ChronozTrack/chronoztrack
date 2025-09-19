import type { tblDepartments, tblJobs, tblResources, tblRolePermissions, tblRoles, tblUserSchedule, tblTimeEvents, tblUserDesignation, tblUsers, tblTemplates } from "./server/db/schema";
import { APP_OPTIONS, APP_TABLES, USER_ACTION, TIME_EVENTS } from "$lib/defaults/app-defaults"
import { Component } from "@lucide/svelte";

export type TableOptionsType =
  | typeof tblJobs
  | typeof tblDepartments
  | typeof tblTimeEvents
  | typeof tblRoles;
export type TableTimeEvents = typeof tblTimeEvents.$inferSelect
export type TableDepartments = typeof tblDepartments.$inferSelect
export type TableJobs = typeof tblJobs.$inferSelect;
export type TableRoles = typeof tblRoles.$inferSelect;
export type OptionsBaseTable = TableDepartments | TableJobs | TableRoles | TableTimeEvents;
export interface SettingsOptions extends Record<string, OptionsBaseTable[]> {
  jobs: TableJobs[];
  departments: TableDepartments[];
  roles: TableRoles[];
  time_events: TableTimeEvents[];
};

export type TableUsers = typeof tblUsers.$inferSelect;
export type TableResources = typeof tblResources.$inferSelect;
export type TableSchedules = typeof tblUserSchedule.$inferSelect;
export type TablePermissions = typeof tblRolePermissions.$inferSelect;
export type TableDesignations = typeof tblUserDesignation.$inferSelect;
export type TableTemplates = typeof tblTemplates.$inferSelect;
export type UserAction = typeof USER_ACTION[number];
export type AppTableType = typeof APP_TABLES[number];
export type AppOptionsType = typeof APP_OPTIONS[number];

export interface UserPreferences {
  background: string | null;
  avatar: string | null;
  theme: "dark" | "light" | "system"
}

export interface UserTimeEventSchedules {
  timeEvent: typeof TIME_EVENTS[number];
  startTime: string;
  endTime: string;
  description: string;
}

export interface ScheduleTemplates {
  userTimezone: string;
  clientTimezone: string;
  clockIn: string;
  clockOut: string;
  events: UserTimeEventSchedules[];
}

export type UserDesignation = TableDesignations & {
  department: TableDepartments;
  job: TableJobs;
}

export type PermissionAction = keyof Pick<typeof tblRolePermissions, "canCreate" | "canRead" | "canUpdate" | "canDelete">;

export type Permissions = {
  [key: string]: {
    [key in PermissionAction]: boolean;
  };
}

type UserCore = Pick<typeof tblUsers.$inferSelect, 'id' | 'active' | 'name' | 'preferences'>;
type RoleCore = Pick<typeof tblRoles.$inferSelect, 'id' | 'code' | 'name'>;
export type JobCore = Pick<typeof tblJobs.$inferSelect, 'id' | 'code' | 'name'>;
export type SupervisorCore = Pick<typeof tblUsers.$inferSelect, "id" | "name">;
export type DepartmentCore = Pick<typeof tblDepartments.$inferSelect, 'id' | 'code' | 'name'>;
export type OptionsCore = Pick<OptionsBaseTable, 'id' | 'code' | 'name'>;

export interface User extends UserCore {
  role: RoleCore;
  designations: null | {
    job: JobCore | null;
    department: DepartmentCore | null;
  }[];
  permissions: Permissions;
}

export interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
}

export type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };


interface BaseAppPage<T = string> {
  id: T;
  resource: string;
  href: string;
  title: string;
  icon?: typeof Component;
}

interface FormAppPage<T = string> extends BaseAppPage<T> {
  formId: `formapp-${string}`;
  formAction: Partial<{
    [K in UserAction]: `?/${K}-${string}`;
  }>
}

export type AppPages<T = string> = BaseAppPage<T> | FormAppPage<T>;
export type DialogAction = 'save' | 'clear' | 'delete' | 'cancel'
