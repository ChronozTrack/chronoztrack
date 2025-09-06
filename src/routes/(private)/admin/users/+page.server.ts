import type { PageServerLoad } from './$types';
import { usersController } from '$lib/server/controller/users';

export const load = (async () => {
  const users = await usersController.selectMany();
  return {
    users
  };
}) satisfies PageServerLoad;