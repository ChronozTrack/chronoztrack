import type { PageServerLoad } from './$types';
import type { User, DepartmentCore } from '$lib/app-types';
import { db } from '$lib/server/db';
import { clientTemplates } from '$lib/server/controller/templates';
import { UserAccess } from '$lib/server/controller/permission';
import { error } from '@sveltejs/kit';
import { tblDepartments, tblJobs, tblTimeEvents } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

const RESOURCE = ['admin.templates'];

export const load = (async ({ locals }) => {
	const userAccess = new UserAccess(locals.user);
	if (!locals.user || !userAccess.canView(RESOURCE)) {
		error(403, { message: 'Forbidden' });
	}

	if (
		!locals.user.designations ||
		(Array.isArray(locals.user.designations) && locals.user.designations.length === 0)
	) {
		error(401, { message: 'Invalid request' });
	}

	const templateOptions = await getOptions(locals.user.designations, userAccess.isAdmin());

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
		}
	}
}

async function getOptions(
	designations: NonNullable<User['designations']>,
	isAdmin: boolean = false
) {
	const departments: DepartmentCore[] = designations
		.map((d) => d.department)
		.filter((d): d is DepartmentCore => d !== null);

	if (isAdmin) {
		return await queryEditorOptions();
	} else {
		return await queryOptions(departments);
	}
}

async function queryEditorOptions() {
	return await db
		.batch([
			db
				.select({ id: tblDepartments.id, code: tblDepartments.code, name: tblDepartments.name })
				.from(tblDepartments).where(eq(tblDepartments.active, true)),
			db.select({ id: tblTimeEvents.id, code: tblTimeEvents.code, name: tblTimeEvents.name }).from(tblTimeEvents)
				.where(eq(tblTimeEvents.active, true)),
			db.select({ id: tblJobs.id, code: tblJobs.code, name: tblJobs.name }).from(tblJobs).where(eq(tblJobs.active, true)),
		])
		.then(([departments, timeEvents, jobs]) => {
			return { departments, timeEvents, jobs };
		});
}

async function queryOptions(departments: DepartmentCore[]) {
	return db.batch([
		db.select({ id: tblTimeEvents.id, code: tblTimeEvents.code, name: tblTimeEvents.name }).from(tblTimeEvents)
			.where(eq(tblTimeEvents.active, true)),
		db.select({ id: tblJobs.id, code: tblJobs.code, name: tblJobs.name }).from(tblJobs).where(eq(tblJobs.active, true)),
	])
		.then(([timeEvents, jobs]) => {
			return { departments, timeEvents, jobs };
		});
}
