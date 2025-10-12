import type {
	DialogAction,
	TablePermissions,
	TableSchedules,
	TableTemplates
} from '$lib/app-types';
import { env } from '$env/dynamic/public';
import { getDateFormat } from '$lib/utils';

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

const envAdminRoles = String(env.PUBLIC_ADMIN_ROLES ?? '')
	.split(',')
	.map((str) => Number(str.trim()))
	.filter((n) => !isNaN(n) && n > 0);
const envDefaultRole = Number(env.PUBLIC_DEFAULT_ROLE);

export const ROLES_ADMIN = envAdminRoles.length ? envAdminRoles : [1, 2];
//DEFAULT_ROLE = null, will default in DBMS to 4;
export const DEFAULT_ROLE = isNaN(envDefaultRole) || envDefaultRole < 4 ? null : envDefaultRole;
export const APP_DOMAIN = env.PUBLIC_DOMAIN ?? 'chronoz';

export const USER_ACTION = ['create', 'read', 'update', 'delete'] as const;
export const APP_OPTIONS = ['jobs', 'departments', 'roles', 'time_events'] as const;

//DEFAULT USER ACCESS [profile, user, time_entries, timesheets]
export const DEFAULT_RESOURCES: Omit<TablePermissions, 'roleId' | 'modifiedBy'>[] = [
	{ resourceId: 1, canCreate: true, canRead: true, canUpdate: true, canDelete: false, locked: true },
	{ resourceId: 2, canCreate: true, canRead: true, canUpdate: true, canDelete: false, locked: true },
	{ resourceId: 3, canCreate: true, canRead: true, canUpdate: true, canDelete: false, locked: true },
	{ resourceId: 4, canCreate: true, canRead: true, canUpdate: true, canDelete: false, locked: true }
];

export const SCHEDULE_TEMPLATE: TableTemplates = {
	id: 0,
	name: 'Default Template',
	departmentId: 1,
	jobId: 4,
	description: 'Default Template',
	createdAt: '',
	template: {
		userTimezone: 'Asia/Manila',
		clientTimezone: 'Asia/Manila',
		clockIn: '06:30',
		clockOut: '15:30',
		events: [
			{
				timeEvent: 'break',
				startTime: '08:00',
				endTime: '08:15',
				duration_min: 15,
				description: 'First Break'
			},
			{
				timeEvent: 'lunch',
				startTime: '12:00',
				endTime: '13:00',
				duration_min: 60,
				description: 'Lunch Break'
			},
			{
				timeEvent: 'break',
				startTime: '14:00',
				endTime: '14:15',
				duration_min: 15,
				description: 'Second Break'
			}
		]
	}
};

export const DEFAULT_SCHEDULE: TableSchedules = {
	id: 0,
	userId: 0,
	description: 'Default Schedule',
	startDate: getDateFormat(),
	...SCHEDULE_TEMPLATE.template
};

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
