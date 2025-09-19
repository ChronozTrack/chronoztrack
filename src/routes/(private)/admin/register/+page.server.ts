import type { PageServerLoad } from './$types';
import type {  User } from '$lib/app-types';
import { getUserAccess, } from '$lib/server/controller/permission';
import { error } from '@sveltejs/kit';
import { queryOptions } from '$lib/server/controller/db-helper';

const RESOURCE = 'admin.register'

export const load = (async ({ locals }) => {
  const userAccess = getUserAccess();

  if (!userAccess.canView(RESOURCE) || !locals.user) {
    error(403, { message: 'Forbidden (register)' });
  }

  const options =  await getOptions(locals.user, userAccess.isAdmin())

  return { options };
}) satisfies PageServerLoad;

async function getOptions(
  user: User,
  isAdmin: boolean = false
) {
  const departmentId = getDepartmentId(user);
  const { departments, jobs, time_events } = await queryOptions({
    departments: { type: isAdmin ? '*' : 'include', ids: departmentId },
    jobs: { type: "*" },
    time_events: { type: "*" }
  })

  return { departments, jobs, time_events }
}

function getDepartmentId(user: User): number[] {
  const designations = user.designations;
  if (!designations) {
    return [];
  }

  return designations.map(d => d.department).map(d => d?.id ?? null).filter(d => d !== null) ?? []
}