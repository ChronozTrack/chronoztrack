import type { PageServerLoad } from './$types';
import type {
	User,
	TableUsers,
	TableDesignations,
	TableSchedules,
} from '$lib/app-types';
import { getUserAccess } from '$lib/server/controller/permission';
import { error, fail } from '@sveltejs/kit';
import { queryOptions } from '$lib/server/controller/db-helper';
import { clientTemplates } from '$lib/server/controller/templates';
import { parseRequest } from '$lib/utils';
import { addUser } from '$lib/server/controller/register';

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
		const parsedData = await parseRequest<{
			user: TableUsers;
			user_designation: TableDesignations;
			user_schedule: TableSchedules;
		}>(request);

		if (!parsedData) {
			return fail(400, { message: 'Invalid Request' });
		}

    const user = addUser(fetch, parsedData)
		return { user };
	}
};

async function getOptions(user: User, isAdmin: boolean = false) {
	const departmentId = getDepartmentId(user);
	const { departments, jobs, time_events } = await queryOptions({
		departments: { type: isAdmin ? '*' : 'include', ids: departmentId },
		jobs: { type: '*' },
		time_events: { type: '*' }
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

