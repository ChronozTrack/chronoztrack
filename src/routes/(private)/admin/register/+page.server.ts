import type { PageServerLoad } from './$types';
import type {
	User,
	UserTablesCore
} from '$lib/app-types';
import { getUserAccess } from '$lib/server/controller/permission';
import { error, fail } from '@sveltejs/kit';
import { queryOptions } from '$lib/server/controller/db-helper';
import { clientTemplates } from '$lib/server/controller/templates';
import { parseRequest } from '$lib/utils';
import { usersController } from '$lib/server/controller/users';
import { prettifyError } from 'zod';

const RESOURCE = 'admin.register';

export const load = (async ({ locals }) => {
	const userAccess = getUserAccess();

	if (!userAccess.canView(RESOURCE) || !locals.user) {
		error(403, { message: 'Forbidden (register)' });
	}

	const options = await getOptions(locals.user, userAccess.isAdmin());

	return { options };
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
	create: async ({ fetch, request }) => {
		const parsedData = await parseRequest<UserTablesCore>(request);

		if (!parsedData) {
			return fail(400, { message: 'Invalid Request' });
		}

		const result = await usersController.create(fetch, parsedData)
		if (!Array.isArray(result) && typeof result === 'object' && result !== null) {
			return fail(400, {
				message: {
					user: result.user ? prettifyError(result.user) : undefined,
					user_designation: result.user_designation ? prettifyError(result.user_designation) : undefined,
					user_schedule: result.user_schedule ? prettifyError(result.user_schedule) : undefined
				}
			})
		}
		return { user: result[0] }
	}
};

async function getOptions(user: User, isAdmin: boolean = false) {
	const departmentId = getDepartmentId(user);
	const { departments, jobs, time_events } = await queryOptions({
		departments: { type: isAdmin ? '*' : 'include', ids: departmentId, active: true },
		jobs: { type: '*', active: true },
		time_events: { type: '*', active: true }
	});

	return { departments, jobs, time_events };
}

function getDepartmentId(user: User): number[] {
	const designations = user.designations;
	if (!designations) {
		return [];
	}

	return (
		designations
			.map((d) => d.department)
			.map((d) => d?.id ?? null)
			.filter((d) => d !== null) ?? []
	);
}

