import type { Actions, PageServerLoad } from './$types';
import type { TablePermissions, User, UserAction } from '$lib/app-types';
import { clientRolePerms } from '$lib/server/controller/settings-permissions';
import { db } from '$lib/server/db';
import { tblResources, tblRoles } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { getUserAccess, UserAccess } from '$lib/server/controller/permission';
import { parseRequest } from '$lib/utils';

const RESOURCE = 'role_permissions';
const canView = (user: User | null) => new UserAccess(user).canView(RESOURCE);

export const load = (async ({locals}) => {
	if(locals.user?.role.id !== 1){
		return fail(403, { message: 'Forbidden' });
	}
	
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
	create: async (event) => {
		return await handleRequest('create', event);
	},
	update: async (event) => {
		return await handleRequest('update', event);
	},
	delete: async (event) => {
		return await handleRequest('delete', event);
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

async function handleRequest(
	action: UserAction,
	{ request }: { locals: App.Locals; request: Request }
) {
	const parsedData = await parseRequest<Record<string, TablePermissions[]>>(request);
	const permData = parsedData['role_permissions'];

	if (!permData) {
		return fail(400, { message: 'Invalid Request' });
	}

	if (!getUserAccess().checkPermission(action, RESOURCE)) {
		return fail(403, { message: `Unauthorized: User can't ${action} ${RESOURCE}` });
	}

	switch (action) {
		case 'create':
			return await clientRolePerms.create(permData);
		case 'update':
			return await clientRolePerms.update(permData);
		case 'delete':
			return await clientRolePerms.delete(permData);
		default:
			return { rows: [] };
	}
}
