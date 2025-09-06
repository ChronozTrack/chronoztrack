import type { PageServerLoad } from './$types';
import type { User, DepartmentCore } from '$lib/app-types';
import { DEFAULT_ADMINS, DEFAULT_ROLES } from "$lib/defaults/app-defaults";
import { db } from "$lib/server/db";
import { UserAccess } from '$lib/server/controller/permission';
import { error } from '@sveltejs/kit';
import { tblDepartments, tblUsers, tblJobs, tblUserDesignation } from '$lib/server/db/schema';
import { notInArray, eq, inArray, and } from 'drizzle-orm';

//hardcoded
const ADMINS = new Set([1, 2]);

const RESOURCE = ['jobs', 'departments', 'admin.users']
export const load = (async ({ locals }) => {
  const userAccess = new UserAccess(locals.user);
  if (!locals.user || !userAccess.canView(RESOURCE)) {
    error(403, { message: 'Forbidden' });
  }

  const templateOptions = await getOptions(locals.user)

  if (!templateOptions || (Array.isArray(templateOptions) && templateOptions.length === 0)) {
    error(401, { message: "Invalid request" })
  }

  return { templateOptions };
}) satisfies PageServerLoad;


async function getOptions(user: User) {
  if (!user.designations || (Array.isArray(user.designations) && user.designations.length === 0)) {
    return []
  }
  const departments: DepartmentCore[] =
  user.designations
    .map(d => d.department)
    .filter((d): d is DepartmentCore => d !== null);

  console.log(queryOptions(departments.map(d => d.id)))
  if (departments.some(dept => DEFAULT_ADMINS.includes(dept.id))) {
    return await queryEditorOptions()
  }
  return departments
}

async function queryEditorOptions() {
  return await db.batch([
    db.select({ id: tblDepartments.id, code: tblDepartments.code, name: tblDepartments.name }).from(tblDepartments),
    db.select({ id: tblJobs.id, code: tblJobs.code, name: tblJobs.name }).from(tblJobs),
    db.select({ id: tblUsers.id, name: tblUsers.name, }).from(tblUsers).where(notInArray(tblUsers.roleId, [3]))
  ]).then(([departments, jobs, supervisors]) => {
    return { departments, jobs, supervisors }
  })
}

async function queryOptions(departmentIds: number[] = []) {
  if (!departmentIds.length) {
    return {}
  }

  // return await db.batch([
  //   db.select({ id: tblJobs.id, code: tblJobs.code, name: tblJobs.name }).from(tblJobs),
  //   db.select({ id: tblUsers.id, name: tblUsers.name }).from(tblUsers)
  //     .leftJoin(tblUserDesignation, eq(tblUsers.id, tblUserDesignation.userId))
  //     .where(and(inArray(tblUserDesignation.departmentId, departmentIds), notInArray(tblUsers.roleId, [3])))
  // ])
  console.log(departmentIds)
  return db.select({ id: tblUsers.id, name: tblUsers.name }).from(tblUsers)
       .leftJoin(tblUserDesignation, eq(tblUsers.id, tblUserDesignation.userId))
       .where(and(inArray(tblUserDesignation.departmentId, [1,2,3,4]), notInArray(tblUsers.roleId, [3]))).toSQL()
}