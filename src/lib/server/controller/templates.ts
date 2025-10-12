import { db } from '$lib/server/db';
import { tblTemplates } from '$lib/server/db/schema';
import { createSchemaFactory } from 'drizzle-zod';
import { eq, inArray } from 'drizzle-orm';
import { z, ZodError } from 'zod';
import type { UserAction } from '$lib/app-types';

type ParsedTemplate = {
	id: FormDataEntryValue;
	name: FormDataEntryValue;
	description: FormDataEntryValue;
	createdAt: FormDataEntryValue;
	departmentId: FormDataEntryValue;
	jobId: FormDataEntryValue;
	template: {
		userTimezone: FormDataEntryValue;
		clientTimezone: FormDataEntryValue;
		clockIn: FormDataEntryValue;
		clockOut: FormDataEntryValue;
		events: {
			timeEvent: FormDataEntryValue;
			startTime: FormDataEntryValue;
			endTime: FormDataEntryValue;
			description: FormDataEntryValue;
		}[];
	};
};


const { createInsertSchema, createUpdateSchema } = createSchemaFactory({ coerce: true });

export class SchedTemplatesControlelr<T extends typeof tblTemplates> {
	#db: typeof db = db;
	#tbl: typeof tblTemplates;

	constructor(tbl: T) {
		this.#tbl = tbl;
	}

	get client() {
		return this.#db;
	}

	public validateFormData(
		action: 'create',
		data: ParsedTemplate[]
	): ReturnType<typeof this.validateInsertData>;

	public validateFormData(
		action: 'update',
		data: ParsedTemplate[]
	): ReturnType<typeof this.validateUpdateData>;

	public validateFormData(
		action: UserAction,
		data: ParsedTemplate[]
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

	public async delete(formData: ParsedTemplate[]) {
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
		formData: ParsedTemplate[]
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

	public async update(formData: ParsedTemplate[]) {
		const validData = this.validateUpdateData(formData);

		if (validData.error) {
			console.error(validData.error);
			return { error: validData.error };
		}

		const { id, ...data } = validData.data[0];

		return {
			rows: await db.update(this.#tbl).set(data).where(eq(this.#tbl.id, id)).returning()
		};
	}

	private validateInsertData(formData: ParsedTemplate[]) {
		return z.array(createInsertSchema(this.#tbl).omit({ id: true })).min(1).safeParse(formData);
	}

	private validateUpdateData(formData: ParsedTemplate[]) {
		return z
			.array(createUpdateSchema(this.#tbl).required({ id: true }))
			.min(1)
			.safeParse(formData);
	}
}

export const clientTemplates = new SchedTemplatesControlelr(tblTemplates);
