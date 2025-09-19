import type { PageServerLoad } from './$types';
import type { User, DepartmentCore, TableTemplates, UserAction, OptionsCore } from '$lib/app-types';
import { db } from '$lib/server/db';
import { clientTemplates } from '$lib/server/controller/templates';
import { queryOptions } from '$lib/server/controller/db-helper'
import { getUserAccess } from '$lib/server/controller/permission';
import { error } from '@sveltejs/kit';
import { tblDepartments, tblJobs, tblTimeEvents } from '$lib/server/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { parseRequest } from '$lib/utils';

const RESOURCE = ['admin.templates'];

export const load = (async ({ locals }) => {
	const userAccess = getUserAccess();
	if (!locals.user || !userAccess.canView(RESOURCE)) {
		error(403, { message: 'Forbidden' });
	}

	const templateOptions = await getOptions(locals.user, userAccess.isAdmin());

	return { templateOptions };
}) satisfies PageServerLoad;

export const actions = {
	'get-templates': async ({ request }) => {
		const formData = await request.formData();
		const departmentId = Number(formData.get('departmentId'));
		if (!departmentId) {
			return fail(400, { message: 'Invalid Department' });
		}

		return {
			templates: await clientTemplates.select(departmentId)
		};
	},
	create: async (event) => {
		return await handleRequest('create', event);
	},
	update: async (event) => {
		return await handleRequest('update', event);
	},
	delete: async (event) => {
		return await handleRequest('delete', event);
	}
};

async function handleRequest(
	action: UserAction,
	{ request }: { locals: App.Locals; request: Request }
) {
	const parsedData = await parseRequest<Record<string, TableTemplates[]>>(request);
	const templateData = parsedData['templates'];

	if (!templateData) {
		return fail(400, { message: "Invalid Request" });
	}

	if (!getUserAccess().checkPermission(action, RESOURCE)) {
		return fail(403, { message: `Unauthorized: User can't ${action} ${RESOURCE}` });
	}

	switch (action) {
		case 'create':
			return await clientTemplates.create(templateData);
		case 'update':
			return await clientTemplates.update(templateData);
		case 'delete':
			return await clientTemplates.delete(templateData);
		default:
			return fail(400, { message: "Invalid Request" });
	}
}

async function getOptions(
	user: User,
	isAdmin: boolean = false
) {
	const departmentId = getDepartmentId(user);
	const { departments, jobs, time_events } = await queryOptions({
		departments: {type: isAdmin ? '*' : 'include', ids: departmentId},
		jobs: {type: "*"},
		time_events: {type: "*"}
	})

	return { departments, jobs, time_events }
}

function getDepartmentId(user: User): number[]{
	const designations = user.designations;
	if(!designations){
		return [];
	}

	return designations.map(d => d.department).map(d => d?.id ?? null).filter(d => d !== null) ?? []
}