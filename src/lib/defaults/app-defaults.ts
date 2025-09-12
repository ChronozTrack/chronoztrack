import type { DialogAction, TablePermissions, TableTemplates } from '$lib/app-types';
import { env } from '$env/dynamic/public';

export const TIME_EVENTS = ['clock', 'break', 'lunch', 'bio', 'clinic', 'meeting'] as const;

export const APP_RESOURCES = [
	'profile',
	'entries',
	'timesheets',
	'settings.options',
	'users',
	'register',
	'role_permissions'
] as const;

export const APP_TABLES = [
	'users',
	'resources',
	'role_permissions',
	'jobs',
	'departments',
	'roles',
	'time_events'
] as const;

const envAdminRoles = (env.PUBLIC_ADMIN_ROLES ?? '')
	.split(',')
	.map((str) => Number(str.trim()))
	.filter((n) => !isNaN(n) && n > 0);
const envDefaultRoles = (env.PUBLIC_DEFAULT_ROLES ?? '')
	.split(',')
	.map((str) => Number(str.trim()))
	.filter((n) => !isNaN(n) && n > 0);
export const ROLES_ADMIN = envAdminRoles.length ? envAdminRoles : [1, 2];
export const ROLES_DEFAULT = envDefaultRoles.length ? envDefaultRoles : [1, 2, 3];

export const USER_ACTION = ['create', 'read', 'update', 'delete'] as const;
export const APP_OPTIONS = ['jobs', 'departments', 'roles', 'time_events'] as const;

//DEFAULT USER ACCESS [profile, user, time_entries, timesheets]
export const DEFAULT_RESOURCES: Omit<TablePermissions, 'roleId'>[] = [
	{
		resourceId: 1,
		canCreate: true,
		canRead: true,
		canUpdate: true,
		canDelete: false,
		locked: true
	},
	{
		resourceId: 2,
		canCreate: true,
		canRead: true,
		canUpdate: true,
		canDelete: false,
		locked: true
	},
	{
		resourceId: 5,
		canCreate: true,
		canRead: true,
		canUpdate: true,
		canDelete: false,
		locked: true
	},
	{ resourceId: 6, canCreate: true, canRead: true, canUpdate: true, canDelete: false, locked: true }
];

export const SCHEDULE_TEMPLATE: TableTemplates = {
	id: 0,
	name: 'Default Template',
	departmentId: 0,
	jobId: 0,
	description: 'Default Template',
	createdAt: '',
	template: {
		userTimezone: 'Asia/Manila',
		clientTimezone: '',
		clockIn: '06:00',
		clockOut: '03:00',
		events: [
			{
				timeEvent: 'break',
				startTime: '08:00',
				endTime: '08:15',
				description: 'First Break'
			},
			{
				timeEvent: 'lunch',
				startTime: '08:00',
				endTime: '08:15',
				description: 'Lunch Break'
			},
			{
				timeEvent: 'break',
				startTime: '02:00',
				endTime: '02:15',
				description: 'Second Break'
			}
		]
	}
}

//DICEBREAR LINK FOR AVATAR
export const AVATAR_SRC =
	'https://api.dicebear.com/9.x/initials/svg?seed=Jessica&radius=50&fontWeight=900';

type DialogMessagesMap = {
	[R in (typeof APP_RESOURCES)[number]]?: {
		[A in DialogAction]?: string;
	};
};

export const DIALOG_MESSAGES: DialogMessagesMap = {
	'settings.options': {
		save: 'Do you want to save your changes?',
		clear: 'Are you sure you want to discard your changes?'
	}
};

export function getDialoMessage(resource: (typeof APP_RESOURCES)[number], action: DialogAction) {
	const message = DIALOG_MESSAGES[resource] ?? {
		save: 'Do you want to save your changes?',
		clear: 'Are you sure you want to discard your changes?'
	};

	return message[action];
}
