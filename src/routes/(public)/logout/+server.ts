import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sessionClient } from "$lib/server/controller/session";

export const POST: RequestHandler = async ({ locals, cookies }) => {
  if (!locals.session) {
    return new Response(null, { status: 401 });
  }

  await sessionClient.invalidateSession(locals.session.id);
  sessionClient.deleteSessionTokenCookie(cookies);

  return redirect(302, '/login');
};