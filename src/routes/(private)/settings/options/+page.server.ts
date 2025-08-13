import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type {  SettingsOptions, User } from '$lib/app-types';

import { UserAccess, type PermissionResource } from '$lib/permission';
import { clientDepartments, clientJobs, clientRoles, clientTimeEvents, getAppOptions } from '$lib/server/controller/settings-options';
import { parseRequest } from '$lib/utils';
import { OPTIONS_TAB } from '$lib/defaults/menus';

const canCreate = (resource: PermissionResource, user: User | null) => (new UserAccess(user)).canCreate(resource);
const canUpdate = (resource: PermissionResource, user: User | null) => (new UserAccess(user)).canUpdate(resource);

export const load = (async ({ locals }) => {
	const userAccess = new UserAccess(locals.user);
	const appOptions = await getAppOptions(userAccess);
	return { appOptions };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request }) => {
		return await createOption({locals,request})

	},
	update: async ({ locals, request }) => {
		return updateOption({locals, request})
	}
} satisfies Actions;

async function createOption({ locals, request }: { locals: App.Locals; request: Request }) {
	const parsedData = await parseRequest<SettingsOptions>(request)
	const [resource, values]  = Object.entries(parsedData)[0]
 
  const optionInfo = OPTIONS_TAB.find((option) => option.id === resource);
  if (!optionInfo) {
    return fail(404, { error: `Option ${resource} not found!` })
  }

  if (!canCreate(resource, locals.user)) {
    return fail(403, { error: `User don't have permission to update ${optionInfo.title}` })
  }

  switch (resource) {
    case 'jobs':
      return await clientJobs.createOptions(values);
    case 'departments':
      return await clientDepartments.createOptions(values);
    case 'roles':
      return await clientRoles.createOptions(values);
    case 'time_events':
      return await clientTimeEvents.createOptions(values);
  }
}

async function updateOption({ locals, request }: { locals: App.Locals; request: Request }) {
  const parsedData = await parseRequest<SettingsOptions>(request)
  const [resource, values]  = Object.entries(parsedData)[0]
  const optionInfo = OPTIONS_TAB.find((option) => option.id === resource);
  if (!optionInfo) {
    return fail(404, { error: `Option ${resource} not found!` })
  }

  if (!canUpdate(resource, locals.user)) {
    return fail(403, { error: `User don't have permission to update ${optionInfo.title}` })
  }

  switch (resource) {
    case 'jobs':
      return await clientJobs.updateOptions(values);
    case 'departments':
      return await clientDepartments.updateOptions(values);
    case 'roles':
      return await clientRoles.updateOptions(values);
    case 'time_events':
      return await clientTimeEvents.updateOptions(values);
  }
}