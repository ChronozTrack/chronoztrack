import type { PageServerLoad } from './$types';
import type { User } from '$lib/app-types';
import { usersController } from '$lib/server/controller/users';
import { getUserAccess } from '$lib/server/controller/permission';
import { error, fail } from '@sveltejs/kit';
import { queryOptions, querySupervisors } from '$lib/server/controller/db-helper';
import { ROLES_ADMIN } from '$lib/defaults/app-defaults';
import { parseRequest } from '$lib/utils';
import { prettifyError } from 'zod';

const RESOURCE = 'admin.users';

export const load = (async ({ locals, url }) => {
  const userAccess = getUserAccess();

  if (!userAccess.canView(RESOURCE) || !locals.user) {
    error(403, { message: 'Forbidden (users)' })
  }

  const options = await getOptions(locals.user, userAccess.isAdmin());
  const supervisors = await querySupervisors();
  const result = await usersController.selectMany(parseFilters(url.searchParams));

  if (result.error) {
    console.error(result.error);
  }

  return {
    options,
    supervisors,
    users: result.rows ?? []
  };
}) satisfies PageServerLoad;

export const actions = {
  'get-users': async ({ request }) => {

    const dataFilters = await parseRequest(request);
    console.log(dataFilters)
    const results = await usersController.selectMany(dataFilters);

    if (results.error) {
      return fail(400, {
        message: prettifyError(results.error)
      })
    }

    return { users: results.rows ?? [] }
  }
}

async function getOptions(user: User, isAdmin: boolean = false) {
  const departmentId = getDepartmentId(user);
  return await queryOptions({
    departments: { type: isAdmin ? '*' : 'include', ids: departmentId, active: null },
    jobs: { type: '*', active: null },
    roles: { type: isAdmin ? '*' : 'exclude', ids: ROLES_ADMIN, active: null },
    time_events: { type: '*', active: null },
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


function parseFilters(params: URLSearchParams) {
  const filter: Record<string, string | string[]> = {};
  params.forEach((value, key) => {
    const paramValue = value.split(",")
    if (paramValue.length === 1) {
      filter[key] = paramValue[0];
    } else {
      filter[key] = paramValue;
    }
  })

  return filter;
}