import type { PageServerLoad } from './$types';
import type { User } from '$lib/app-types';
import { usersController } from '$lib/server/controller/users';
import { getUserAccess } from '$lib/server/controller/permission';
import { error,fail } from '@sveltejs/kit';
import { queryOptions } from '$lib/server/controller/db-helper';
import { ROLES_ADMIN } from '$lib/defaults/app-defaults';

const RESOURCE = 'admin.users';

export const load = (async ({locals}) => {
  const userAccess = getUserAccess();
  
  if(!userAccess.canView(RESOURCE) || !locals.user){
    error(403, {message: 'Forbidden (users)'})
  }

  const options = await getOptions(locals.user, userAccess.isAdmin());
  const users = await usersController.selectMany({});

  return {
    options,
    users
  };
}) satisfies PageServerLoad;

async function getOptions(user: User, isAdmin: boolean = false) {
  const departmentId = getDepartmentId(user);
  return await queryOptions({
    departments: { type: isAdmin ? '*' : 'include', ids: departmentId, active: null },
    jobs: { type: '*', active: null },
    roles: {type: isAdmin ? '*' : 'exclude', ids: ROLES_ADMIN, active: null},
    time_events: {type: '*', active: null},
  });
}

function getDepartmentId(user: User): number[] {
  const designations = user.designations;
  if (!designations) {
    return [];
  }

  return (
    designations
      .map((d) => d.department)
      .map((d) => d?.id ?? null)
      .filter((d) => d !== null) ?? []
  );
}
