import { db } from '$lib/server/db';
import { tblTemplates } from '$lib/server/db/schema';
import { createSchemaFactory } from 'drizzle-zod';
import { eq, inArray, sql, SQL } from 'drizzle-orm';
import { z, ZodError } from 'zod';
import type { TableTemplates, UserAction } from '$lib/app-types';

type UpdatableFields = keyof Partial<TableTemplates>;

const { createInsertSchema, createUpdateSchema } = createSchemaFactory({ coerce: true });

export class SchedTemplatesControlelr<T extends typeof tblTemplates> {
	#db: typeof db = db;
	#tbl: typeof tblTemplates;
	#updatableFields: Partial<keyof Partial<TableTemplates>>[];

	constructor(tbl: T, updateFields?: Partial<keyof Partial<TableTemplates>>[]) {
		this.#tbl = tbl;
		this.#updatableFields = updateFields
			? updateFields
			: ['name', 'departmentId', 'jobId', 'description', 'template'];
	}

	get client() {
		return this.#db;
	}

	public validateFormData(
		action: 'create',
		data: Record<string, FormDataEntryValue>[]
	): ReturnType<typeof this.validateInsertData>;

	public validateFormData(
		action: 'update',
		data: Record<string, FormDataEntryValue>[]
	): ReturnType<typeof this.validateUpdateData>;

	public validateFormData(
		action: UserAction,
		data: Record<string, FormDataEntryValue>[]
	): ReturnType<typeof this.validateInsertData> | ReturnType<typeof this.validateUpdateData> {
		if (action === 'create') {
			return this.validateInsertData(data);
		} else if (action === 'update') {
			return this.validateUpdateData(data);
		} else {
			throw new Error('Invalid User Action!');
		}
	}

	public async select(departmentId: number): Promise<{ rows: T['$inferSelect'][] }> {
		return { rows: await db.select().from(this.#tbl).where(eq(this.#tbl.departmentId, departmentId)) };
	}

	public async delete(formData: Record<string, FormDataEntryValue>[]) {
		const validData = this.validateUpdateData(formData);

		if (validData.error) {
			console.error(validData.error);
			return { error: validData.error };
		}

		const ids = validData.data.map((val) => val.id);
		return {
			rows: await this.#db
				.delete(this.#tbl)
				.where(inArray(this.#tbl.id, ids))
				.returning({ id: this.#tbl.id })
		};
	}

	public async create(
		formData: Record<string, FormDataEntryValue>[]
	): Promise<
		| { rows: T['$inferSelect'][]; error?: never }
		| { rows?: never; error: ZodError<T['$inferInsert'][]> }
	> {
		const validData = this.validateInsertData(formData);

		if (validData.error) {
			return { error: validData.error };
		}

		return { rows: await this.#db.insert(this.#tbl).values(validData.data).returning() };
	}

	public async update(formData: Record<string, FormDataEntryValue>[]) {
		const validData = this.validateUpdateData(formData);

		if (validData.error) {
			console.error(validData.error);
			return { error: validData.error };
		}

		const ids = validData.data.map((u) => u.id);
		const sqlFields = validData.data.reduce(
			(obj, row) => {
				this.#updatableFields.forEach((field) => {
					if (field in row) {
						if (!Object.hasOwn(obj, field)) {
							obj[field] = [];
							obj[field].push(sql`(case`);
						}

						obj[field].push(sql`WHEN ${this.#tbl.id} = ${row.id} THEN ${row[field]}`);
					}
				});
				return obj;
			},
			{} as Record<UpdatableFields, SQL<unknown>[]>
		);

		const sqlKeys = Object.keys(sqlFields) as (keyof typeof sqlFields)[];
		const sqlUpdates = sqlKeys.reduce<Record<(typeof sqlKeys)[number], SQL>>(
			(acc, field) => {
				sqlFields[field].push(sql`END)`);
				acc[field] = sql.join(sqlFields[field], sql.raw(' '));
				return acc;
			},
			{} as Record<(typeof sqlKeys)[number], SQL>
		);

		return {
			rows: await db.update(this.#tbl).set(sqlUpdates).where(inArray(this.#tbl.id, ids)).returning()
		};
	}

	private validateInsertData(formData: Record<string, FormDataEntryValue>[]) {
		return z.array(createInsertSchema(this.#tbl)).min(1).safeParse(formData);
	}

	private validateUpdateData(formData: Record<string, FormDataEntryValue>[]) {
		return z
			.array(createUpdateSchema(this.#tbl).required({ id: true }))
			.min(1)
			.safeParse(formData);
	}
}

export const clientTemplates = new SchedTemplatesControlelr(tblTemplates);
