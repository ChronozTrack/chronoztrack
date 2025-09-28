import type { TableUsers, TableDesignations, TableSchedules, SvelteFetch } from '$lib/app-types';
import type { RawFormDataShape } from '$lib/utils';
import { ROLES_DEFAULT, APP_DOMAIN } from '$lib/defaults/app-defaults';
import { hashPassword } from './auth';
import { createSchemaFactory } from 'drizzle-zod';
import { tblUserDesignation, tblUsers, tblUserSchedule } from '../db/schema';

const { createInsertSchema } = createSchemaFactory({ coerce: true });

export async function addUser(
	fetch: SvelteFetch,
	formData: RawFormDataShape<{
		user: TableUsers;
		user_designation: TableDesignations;
		user_schedule: TableSchedules;
	}>
) {
	const { user, user_designation, user_schedule } = formData;
	const userDefault = await setUsersDefaults(fetch, Number(user.id));
	Object.assign(user, userDefault);
	user_designation.userId = user.id;
	user_schedule.userId = user.id;

	const validUser = createInsertSchema(tblUsers).safeParse(user);
	const validDesignation = createInsertSchema(tblUserDesignation).safeParse(user_designation);
	const validSchedule = createInsertSchema(tblUserSchedule).safeParse(user_schedule);
	if (!validUser.success) {
		console.log(validUser.error);
	}
	console.log(validDesignation.success);
	console.log(validSchedule.success);
}

async function setUsersDefaults(fetch: SvelteFetch, userId: number) {
	const { data, error } = await hashPassword(
		fetch,
		`${userId}@${String(APP_DOMAIN).toLowerCase()}`
	);

	if (error || !data) {
		return { user: null, error: { message: 'Failed to hash password, please try again later' } };
	}

	return {
		passwordHash: data,
		roleId: ROLES_DEFAULT[0]
	};
}
