import type { AppPages } from "$lib/app-types";
import { FileClockIcon, CalendarClockIcon, ClockArrowDownIcon, UsersIcon } from '@lucide/svelte/icons';

export const OPTIONS_TAB: AppPages<'jobs' | 'departments' | 'roles' | 'time_events'>[] = [
  {
    resource: 'settings.options',
    id: 'jobs',
    href: '#jobs',
    title: "Jobs",
    icon: 'work',
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
    icon: 'apartment',
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
    icon: 'supervisor_account',
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
    icon: 'timer',
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
    icon: 'playlist_add',
    id: 'options',
  },
  {
    resource: 'settings.permissions',
    href: "/settings/permissions",
    title: "Permissions",
    icon: 'admin_panel_settings',
    id: 'permissions'
  },
  {
    resource: 'settings.alias',
    href: "/settings/alias",
    title: 'Alias',
    icon: 'domino_mask',
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