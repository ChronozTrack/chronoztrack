import type { AppPages, AppOptionsType } from "$lib/app-types";
import {
  FileClockIcon,
  CalendarClockIcon,
  ClockArrowDownIcon,
  UsersIcon,
  BriefcaseIcon,
  BuildingIcon,
  ShieldUserIcon,
  TimerIcon,
  FileCogIcon,
  TagsIcon,
  ShieldCheckIcon
} from '@lucide/svelte/icons';

export const OPTIONS_TAB: AppPages<AppOptionsType>[] = [
  {
    resource: 'settings.options',
    id: 'jobs',
    href: '#jobs',
    title: "Jobs",
    icon: BriefcaseIcon,
    formId: "formapp-jobs",
    formAction: {
      create: "?/create-jobs",
      update: "?/update-jobs"
    }
  },
  {
    resource: 'settings.options',
    id: 'departments',
    href: "#departments",
    title: 'Departments',
    icon: BuildingIcon,
    formId: `formapp-departments`,
    formAction: {
      create: `?/create-departments`,
      update: `?/update-departments`
    }
  },
  {
    resource: 'settings.options',
    id: 'roles',
    href: '#roles',
    title: 'Roles',
    icon: ShieldCheckIcon,
    formId: `formapp-roles`,
    formAction: {
      create: `?/create-roles`,
      update: `?/update-roles`
    }
  },
  {
    resource: 'settings.options',
    id: 'time_events',
    href: '#time_events',
    title: "Time Events",
    icon: TimerIcon,
    formId: "formapp-time_events",
    formAction: {
      create: "?/create-time_events",
      update: "?/update-time_events"
    }
  },
]

export const SETTING_PAGES: AppPages[] = [
  {
    resource: 'settings.options',
    href: "/settings/options",
    title: "Options",
    icon: FileCogIcon,
    id: 'options',
  },
  {
    resource: 'settings.permissions',
    href: "/settings/permissions",
    title: "Permissions",
    icon: ShieldUserIcon,
    id: 'permissions'
  },
  {
    resource: 'settings.alias',
    href: "/settings/alias",
    title: 'Alias',
    icon: TagsIcon,
    id: 'alias',
  },
]

export const APP_PAGES: AppPages[] = [
  {
    resource: 'entries',
    href: '/entries',
    title: 'Entries',
    icon: ClockArrowDownIcon,
    id: 'entries',
  },
  {
    resource: 'timesheets',
    href: '/timesheets',
    title: 'Timesheets',
    icon: FileClockIcon,
    id: 'timesheets'
  },
  {
    resource: "users",
    href: "/users",
    title: "Users",
    icon: UsersIcon,
    id: 'users',
  },
  {
    resource: 'schedules',
    href: "/schedules",
    title: "Schedules",
    icon: CalendarClockIcon,
    id: 'schedules'
  },
]