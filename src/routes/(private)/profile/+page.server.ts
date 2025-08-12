import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    console.log(formData);
    return {};
  },

} satisfies Actions;