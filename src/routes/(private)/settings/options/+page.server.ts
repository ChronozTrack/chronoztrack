import { UserAccess } from '$lib/permission';
import { getAppOptions } from '$lib/server/controller/settings-options';
import type { Actions} from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const userAccess = new UserAccess(locals.user)
  const appOptions = await getAppOptions(userAccess);
  return { appOptions };
}) satisfies PageServerLoad;

export const actions = {
  "create-jobs": async({request}) => {
    const formApp = await request.formData();
    console.log(formApp)
    return {}
  }
} satisfies Actions;