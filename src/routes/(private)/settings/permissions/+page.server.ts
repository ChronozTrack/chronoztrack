import { clientRolePerms } from '$lib/server/controller/settings-permissions';
import { db } from '$lib/server/db';
import { tblResources, tblRoles } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

const RESOURCE = 'role_permissions';

export const load = (async ({ locals: { user } }) => {
  return { settingsPermissions: await getRolesResource() }
}) satisfies PageServerLoad;

async function getRolesResource() {
  return await db.batch([
    db.select().from(tblRoles),
    db.select().from(tblResources),
  ])
    .then(([roles, resources]) => ({ roles, resources }))
    .catch((err) => {
      console.error(err);
      return { roles: [], resources: [] }
    })
}
