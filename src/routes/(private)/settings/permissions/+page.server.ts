import { clientRolePerms } from '$lib/server/controller/settings-permissions';
import { db } from '$lib/server/db';
import { tblResources, tblRoles } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const RESOURCE = 'role_permissions';

export const load = (async ({ locals: { user } }) => {
  return { settingsPermissions: await getRolesResource() }
}) satisfies PageServerLoad;

export const actions = {
  "get-permissions": async ({ locals, request }) => {
    const formData = await request.formData();
    const roleId = Number(formData.get('roleId'))
    console.log(formData)
    if (!roleId) {
      return fail(400, { message: 'Invalid Role Id' })
    }

    return {
      permissions: await clientRolePerms.select(roleId)
    }
  },

} satisfies Actions;

async function getRolesResource() {
  return db.batch([
    db.select().from(tblRoles),
    db.select().from(tblResources),
  ])
    .then(([roles, resources]) => ({ roles, resources }))
    .catch((err) => {
      console.error(err);
      return { roles: [], resources: [] }
    })
}