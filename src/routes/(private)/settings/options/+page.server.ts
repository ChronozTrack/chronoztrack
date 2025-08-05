import { UserAccess } from '$lib/permission';
import { getAppOptions } from '$lib/server/controller/settings-options';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const userAccess = new UserAccess(locals.user)
  const appOptions = await getAppOptions(userAccess);
  return { appOptions };
}) satisfies PageServerLoad;