import { validateUser } from "$lib/server/controller/auth";
import { sessionClient, generateSessionToken } from "$lib/server/controller/session";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "../$types";

export const actions = {
  default: async ({ fetch, cookies, request }) => {
    const form = await request.formData();
    const employeeId = Number(form.get("employeeId"));
    const password = String(form.get("password"));

    const userId = await validateUser(fetch, employeeId, password);

    if (!userId) {
      return fail(400, { message: "Invalid username or password!" })
    }

    const userToken = generateSessionToken();
    const session = await sessionClient.createSession(userToken, userId);

    sessionClient.setSessionTokenCookie(cookies, userToken, session.expiresAt)

    return redirect(301, "/entries")
  }
} satisfies Actions;