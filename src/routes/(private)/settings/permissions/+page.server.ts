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
  'create-permissions': async (event) => {
    await handleRequest('create', event)
    return {};
  },
  'update-permissions': async (event) => {
    await handleRequest('update', event);
    return {};
  },
  'delete-permissions': async(event) => {
    await handleRequest('delete', event);
    return {}
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

async function handleRequest(action: UserAction, { request }: { locals: App.Locals; request: Request }) {
  const parsedData = await parseRequest<Record<string, TablePermissions[]>>(request)
  const permData = parsedData['role_permissions']

  if(!permData){
    return fail(400, { message: 'Invalid Request' });
  }

  if(!getUserAccess().checkPermission(action, RESOURCE)){
    return fail(401, { message: 'Unauthorized' })
  }

  console.log(permData)
}
