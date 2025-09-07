import type { PageServerLoad } from './$types';
import type { User, DepartmentCore } from '$lib/app-types';
import { db } from '$lib/server/db';
import { clientTemplates } from '$lib/server/controller/templates';
import { UserAccess } from '$lib/server/controller/permission';
import { error } from '@sveltejs/kit';
import { tblDepartments, tblUsers, tblJobs, tblUserDesignation } from '$lib/server/db/schema';
import { notInArray, eq, inArray, and } from 'drizzle-orm';

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
	const templates = await getTemplates(locals.user.designations, userAccess.isAdmin());

	return { templateOptions, templates };
}) satisfies PageServerLoad;

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
				.from(tblDepartments),
			db.select({ id: tblJobs.id, code: tblJobs.code, name: tblJobs.name }).from(tblJobs),
			db
				.select({ id: tblUsers.id, name: tblUsers.name })
				.from(tblUsers)
				.where(notInArray(tblUsers.roleId, [3]))
		])
		.then(([departments, jobs, supervisors]) => {
			return { departments, jobs, supervisors };
		});
}

async function queryOptions(departments: DepartmentCore[]) {
	const departmentIds = departments.map((d) => d.id);

	return await db
		.batch([
			db.select({ id: tblJobs.id, code: tblJobs.code, name: tblJobs.name }).from(tblJobs),
			db
				.select({ id: tblUsers.id, name: tblUsers.name })
				.from(tblUsers)
				.leftJoin(tblUserDesignation, eq(tblUsers.id, tblUserDesignation.userId))
				.where(
					and(
						inArray(tblUserDesignation.departmentId, departmentIds),
						notInArray(tblUsers.roleId, [3])
					)
				)
		])
		.then(([jobs, supervisors]) => {
			return { departments, jobs, supervisors };
		});
}

async function getTemplates(designations: NonNullable<User['designations']>, isAdmin: boolean) {
	const departmentId = designations.map((d) => d.department?.id ?? 0).filter(Boolean);
	return await clientTemplates.select(departmentId, isAdmin);
}
