import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AppOptionsType, SettingsOptions, UserAction } from '$lib/app-types';

import { getUserAccess, UserAccess } from '$lib/server/controller/permission';
import { getAppOptions, postOption } from '$lib/server/controller/settings-options';
import { parseRequest } from '$lib/utils';
import { OPTIONS_TAB } from '$lib/defaults/menus';

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
	{ request }: { locals: App.Locals; request: Request }
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

	if (!getUserAccess().checkPermission(action, resource)) {
		return fail(403, {
			error: `User don't have permission to ${String(action).toUpperCase()} ${optionInfo.title}`
		});
	}

	return await postOption(action, resource, values);
}
