import type { DialogAction, TablePermissions } from '$lib/app-types';

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

export const USER_ACTION = ['create', 'read', 'update', 'delete'] as const;
export const APP_OPTIONS = ['jobs', 'departments', 'roles', 'time_events'] as const;
export const DEFAULT_ADMINS = [1, 2];
export const DEFAULT_ROLES = [1, 2, 3];

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

