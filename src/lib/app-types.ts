import type { tblDepartments, tblJobs, tblResources, tblRolePermissions, tblRoles, tblSchedules, tblTimeEvents, tblUserDesignation, tblUsers } from "./server/db/schema";
import { APP_OPTIONS, APP_TABLES, USER_ACTION } from "$lib/defaults/app-defaults"
import { Component } from "@lucide/svelte";

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
export type TableSchedules = typeof tblSchedules.$inferSelect;
export type TablePermissions = typeof tblRolePermissions.$inferSelect;
export type TableDesignations = typeof tblUserDesignation.$inferSelect;
export type UserAction = typeof USER_ACTION[number];
export type AppTableType = typeof APP_TABLES[number];

export interface UserPreferences {
  background: string | null;
  avatar: string | null;
  theme: "dark" | "light" | "system"
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

export interface User extends Pick<TableUsers, 'id' | 'active' | 'name' | 'preferences'> {
  role: Pick<TableRoles, 'id' | 'code' | 'name'>;
  designations: null | {
    job: Pick<TableJobs, 'id' | 'name'> | null;
    department: Pick<TableDepartments, 'id' | 'name'> | null;
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