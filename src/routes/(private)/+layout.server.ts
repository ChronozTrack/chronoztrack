import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { APP_PAGES, SETTING_PAGES } from '$lib/defaults/menus';

export const load = (async ({ locals }) => {
  return {
    user: locals.user,
  };

}) satisfies LayoutServerLoad;