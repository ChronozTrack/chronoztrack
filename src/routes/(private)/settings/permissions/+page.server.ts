import { clientRolePerms } from '$lib/server/controller/settings-permissions';
import { db } from '$lib/server/db';
import { tblResources, tblRoles } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserAccess } from '$lib/permission';
import type { User } from '$lib/app-types';
import { parseRequest } from '$lib/utils';

const RESOURCE = 'role_permissions';
const canView = (user: User | null) => new UserAccess(user).canView(RESOURCE);
const canCreate = (user: User | null) => new UserAccess(user).canCreate(RESOURCE);

export const load = (async () => {
	return { settingsPermissions: await getRolesResource() };
}) satisfies PageServerLoad;

export const actions = {
	'get-permissions': async ({ locals, request }) => {
		if (!canView(locals.user)) {
			return fail(401, { message: 'Unauthorized' });
		}
		const formData = await request.formData();
		const roleId = Number(formData.get('roleId'));

		if (!roleId) {
			return fail(400, { message: 'Invalid Role Id' });
		}

		return {
			permissions: await clientRolePerms.select(roleId)
		};
	},
	'create-permissions': async ({ locals, request }) => {
		if (!canCreate(locals.user)) {
			return fail(401, { message: 'Unauthorized' });
		}

		const parsedData = await parseRequest(request);
		console.log(parsedData);

		return {};
	}
} satisfies Actions;

async function getRolesResource() {
	return db
		.batch([db.select().from(tblRoles), db.select().from(tblResources)])
		.then(([roles, resources]) => ({ roles, resources }))
		.catch((err) => {
			console.error(err);
			return { roles: [], resources: [] };
		});
}
