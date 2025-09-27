import type { HandleServerError, Handle } from '@sveltejs/kit'
import { UserAccess } from '$lib/server/controller/permission';
import { sessionClient } from '$lib/server/controller/session';
import { error, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { LibsqlError } from '@libsql/client';

export const handleError: HandleServerError = ({ error, status}) => {
  const uniqueRegex = new RegExp('UNIQUE constraint failed', 'i')
  console.error(error)
  if(error instanceof LibsqlError){
    if(uniqueRegex.test(error.message)){
      return {
        status: 409,
        message: 'Duplicates not allowed. Please choose another name or id'
      }
    }
  }

  return {
    status, 
    message: 'Sorry, server failed to process your request.'
  }
}


export const auth: Handle = async ({ event, resolve }) => {
  const token = sessionClient.getSessionToken(event.cookies);
  if (!token) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await sessionClient.validateSessionToken(token);

  if (session !== null) {
    sessionClient.setSessionTokenCookie(event.cookies, token, session.expiresAt);
    event.locals.user = user;
    event.locals.session = session;
  } else {
    sessionClient.deleteSessionTokenCookie(event.cookies);
  }

  return resolve(event);
}

export const route: Handle = async ({ event, resolve }) => {
  if (!event.locals.user) {
    if (event.url.pathname !== '/login') {
      return redirect(301, '/login')
    }

    return resolve(event)
  }

  const userAccess = new UserAccess(event.locals.user)
  if (event.url.pathname === '/logout') {
    return resolve(event)
  }

  if (userAccess.canView(event.url)) {
    return resolve(event)
  } else if (userAccess.canView('profile')) {
    return redirect(301, '/profile')
  }

  error(403)
}

export const handle: Handle = sequence(auth, route)