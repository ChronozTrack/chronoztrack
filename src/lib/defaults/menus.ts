import type { AppPages, AppOptionsType } from '$lib/app-types';
/**
 * https://github.com/lucide-icons/lucide/issues/1284
 * importing directly from '@lucide/svelte/icons' loads the entire icons
 */
import FileClock from '@lucide/svelte/icons/file-clock';
import CalendarClock from '@lucide/svelte/icons/calendar-clock';
import ClockArrowDown from '@lucide/svelte/icons/clock-arrow-down';
import Users from '@lucide/svelte/icons/users';
import Briefcase from '@lucide/svelte/icons/briefcase';
import Building from '@lucide/svelte/icons/building';
import ShieldUser from '@lucide/svelte/icons/shield-user';
import Timer from '@lucide/svelte/icons/timer';
import FileCog from '@lucide/svelte/icons/file-cog';
import Tags from '@lucide/svelte/icons/tags';
import ShieldCheck from '@lucide/svelte/icons/shield-check';
import UserPlus from '@lucide/svelte/icons/user-plus';
import BookDashed from '@lucide/svelte/icons/book-dashed';

export const OPTIONS_TAB: AppPages<AppOptionsType>[] = [
	{
		resource: 'settings.options',
		id: 'jobs',
		href: '#jobs',
		title: 'Jobs',
		icon: Briefcase,
		formId: 'formapp-jobs',
		formAction: {
			create: '?/create-jobs',
			update: '?/update-jobs'
		}
	},
	{
		resource: 'settings.options',
		id: 'departments',
		href: '#departments',
		title: 'Departments',
		icon: Building,
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
		icon: ShieldCheck,
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
		title: 'Time Events',
		icon: Timer,
		formId: 'formapp-time_events',
		formAction: {
			create: '?/create-time_events',
			update: '?/update-time_events'
		}
	}
];

export const SETTING_PAGES: AppPages[] = [
	{
		resource: 'settings.options',
		href: '/settings/options',
		title: 'Options',
		icon: FileCog,
		id: 'options'
	},
	{
		resource: 'settings.permissions',
		href: '/settings/permissions',
		title: 'Permissions',
		icon: ShieldUser,
		id: 'permissions'
	},
	{
		resource: 'settings.alias',
		href: '/settings/alias',
		title: 'Alias',
		icon: Tags,
		id: 'alias'
	}
];

export const APP_PAGES: AppPages[] = [
	{
		resource: 'entries',
		href: '/entries',
		title: 'Entries',
		icon: ClockArrowDown,
		id: 'entries'
	},
	{
		resource: 'timesheets',
		href: '/timesheets',
		title: 'Timesheets',
		icon: FileClock,
		id: 'timesheets'
	}
];

export const ADMIN_PAGES: AppPages[] = [
	{
		resource: 'admin.users',
		href: '/admin/users',
		title: 'Users',
		icon: Users,
		id: 'users'
	},
	{
		resource: 'admin.schedules',
		href: '/admin/schedules',
		title: 'Schedules',
		icon: CalendarClock,
		id: 'schedules'
	},
	{
		resource: 'admin.templates',
		href: '/admin/templates',
		title: 'Templates',
		icon: BookDashed,
		id: 'templates'
	},
	{
		resource: 'admin.register',
		href: '/admin/register',
		title: 'Register',
		icon: UserPlus,
		id: 'register'
	}
];

