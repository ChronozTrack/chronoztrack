import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AppOptionsType, SettingsOptions, User, UserAction } from '$lib/app-types';

import { UserAccess, type PermissionResource } from '$lib/permission';
import { getAppOptions, postOption } from '$lib/server/controller/settings-options';
import { parseRequest } from '$lib/utils';
import { OPTIONS_TAB } from '$lib/defaults/menus';

const canCreate = (resource: PermissionResource, user: User | null) =>
	new UserAccess(user).for(resource).canCreate();
const canUpdate = (resource: PermissionResource, user: User | null) =>
	new UserAccess(user).for(resource).canUpdate();

export const load = (async ({ locals }) => {
	const userAccess = new UserAccess(locals.user);
	return { settingsOptions: await getAppOptions(userAccess) };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request }) => {
		return await handleRequest('create', { locals, request });
	},
	update: async ({ locals, request }) => {
		return await handleRequest('update', { locals, request });
	}
} satisfies Actions;

async function handleRequest(
	action: UserAction,
	{ locals, request }: { locals: App.Locals; request: Request }
) {
	const parsedData = await parseRequest<SettingsOptions>(request);
	const [resource, values] = Object.entries(parsedData)[0] as [
		AppOptionsType,
		Record<string, FormDataEntryValue>[]
	];

	const optionInfo = OPTIONS_TAB.find((option) => option.id === resource);

	if (!optionInfo) {
		return fail(404, { error: `Option ${resource} not found!` });
	}

	if (
		(action === 'create' && !canCreate(resource, locals.user)) ||
		(action === 'update' && !canUpdate(resource, locals.user))
	) {
		return fail(403, {
			error: `User don't have permission to ${String(action).toUpperCase()} ${optionInfo.title}`
		});
	}

	return await postOption(action, resource, values);
}
