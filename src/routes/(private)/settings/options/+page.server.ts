import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { OptionsBaseTable } from '$lib/app-types';

import { UserAccess } from '$lib/permission';
import { getAppOptions } from '$lib/server/controller/settings-options';
import { parseFormData } from '$lib/utils';

export const load = (async ({ locals }) => {
	const userAccess = new UserAccess(locals.user);
	const appOptions = await getAppOptions(userAccess);
	return { appOptions };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const parsed = parseFormData<OptionsBaseTable>(formData);
		console.log(parsed);
		return {};
	},
	update: async ({ request }) => {
		const formData = await request.formData();
		const parsed = parseFormData<OptionsBaseTable>(formData);
		console.log(parsed);
		return {};
	}
} satisfies Actions;
