import type { AppOptionsType, SettingsOptions, UserAction } from "$lib/app-types";
import { APP_OPTIONS } from "$lib/defaults/app-defaults"
import { db } from "$lib/server/db";
import { z, ZodError } from "zod";
import { tblRoles, tblDepartments, tblJobs, tblTimeEvents } from "$lib/server/db/schema";
import { createSchemaFactory } from "drizzle-zod";
import { inArray, SQL, sql } from "drizzle-orm";
import type { UserAccess } from "../../permission";

type TableOptionsType = typeof tblJobs | typeof tblDepartments | typeof tblTimeEvents | typeof tblRoles;
type UpdatableFields = Partial<keyof Pick<TableOptionsType, "id" | "active" | "code" | "name" | "description" | "locked">>;
const { createInsertSchema, createUpdateSchema } = createSchemaFactory({ coerce: true });
const TABLE_MAPS: Record<typeof APP_OPTIONS[number], TableOptionsType> = {
  jobs: tblJobs,
  departments: tblDepartments,
  roles: tblRoles,
  time_events: tblTimeEvents
}

export class TableOptionsController<T extends TableOptionsType> {
  #db = db;
  #tblOptions: TableOptionsType;
  #updatableFields: UpdatableFields[];

  constructor(tblOptions: TableOptionsType, updateFields?: UpdatableFields[]) {
    this.#tblOptions = tblOptions;
    this.#updatableFields = updateFields?.length ? updateFields : ['name', 'code', 'description', 'active', 'locked'];
  }

  get client() {
    return this.#db;
  }

  public validateFormData(action: 'create', data: Record<string, FormDataEntryValue>[]): ReturnType<typeof this.validateInsertData>;
  public validateFormData(action: 'update', data: Record<string, FormDataEntryValue>[]): ReturnType<typeof this.validateUpdateData>;
  public validateFormData(action: UserAction, data: Record<string, FormDataEntryValue>[]): ReturnType<typeof this.validateInsertData> | ReturnType<typeof this.validateUpdateData> {
    if (action === 'create') {
      return this.validateInsertData(data);
    } else if (action === 'update') {
      return this.validateUpdateData(data);
    } else {
      throw new Error("Invalid User Action!");
    }
  }

  public async createOptions(data: Record<string, FormDataEntryValue>[]):
    Promise<{ rows: T['$inferSelect'][]; error?: never } | { rows?: never; error: ZodError<T["$inferInsert"][]> }> {
    const validData = this.validateInsertData(data);

    if (validData.error) {
      return { error: validData.error };
    }

    return { rows: await this.#db.insert(this.#tblOptions).values(validData.data).returning() };
  }


  public async updateOptions(
    formData: Record<string, FormDataEntryValue>[]
  ): Promise<{ rows: T['$inferSelect'][]; error?: never } | { rows?: never; error: ZodError<Partial<T["$inferSelect"]>[]> }> {

    const validData = this.validateUpdateData(formData);

    if (validData.error) {
      return { error: validData.error as ZodError<Partial<T["$inferSelect"]>[]> };
    }

    const ids = validData.data.map((u) => u.id);
    const sqlFields = validData.data.reduce((obj, row) => {
      this.#updatableFields.forEach(field => {
        if (field in row) {
          if (!obj.hasOwnProperty(field)) {
            obj[field] = [];
            obj[field].push(sql`(case`)
          }

          obj[field].push(sql`WHEN ${this.#tblOptions.id} = ${row.id} THEN ${row[field]}`);
        }
      })
      return obj;
    }, {} as Record<UpdatableFields, SQL<unknown>[]>)

    const sqlUpdates = (Object.keys(sqlFields) as (keyof typeof sqlFields)[])
      .reduce<Record<keyof typeof sqlFields, SQL>>((acc, field) => {
        sqlFields[field].push(sql`END)`);
        acc[field] = sql.join(sqlFields[field], sql.raw(' '));
        return acc;
      }, {} as Record<keyof typeof sqlFields, SQL>);

    return { rows: await db.update(this.#tblOptions).set(sqlUpdates).where(inArray(this.#tblOptions.id, ids)).returning() };
  }

  private validateInsertData(data: Record<string, FormDataEntryValue>[]) {
    return z.array(
      createInsertSchema(this.#tblOptions, {
        description: (schema) => schema.transform((val) => val.length > 1 ? val : null),
      }).omit({ id: true })
    ).min(1).safeParse(data)
  };

  private validateUpdateData(data: Record<string, FormDataEntryValue>[]) {
    return z.array(
      createUpdateSchema(this.#tblOptions, {
        description: (schema) => schema.transform((val) => val.length > 1 ? val : null),
      }).required({ id: true })
    ).min(1).safeParse(data)
  };
}

function filterOptionAccess(userAccess: UserAccess) {
  const userOptions = APP_OPTIONS.filter(opt => userAccess.canView(opt));
  return {
    userOptions,
    optionsTable: userOptions.map(opt => TABLE_MAPS[opt])
  }
}

export async function getAppOptions(userAccess: UserAccess): Promise<SettingsOptions> {
  const optionsValues = { departments: [], roles: [], jobs: [], time_events: [] }
  const { userOptions, optionsTable } = filterOptionAccess(userAccess);

  if (!optionsTable.length) {
    return optionsValues
  }

  const batchQuery = optionsTable.map(tbl => db.select().from(tbl))

  //build tuple to satisfy db.batch minimum array length
  return await db.batch([batchQuery[0], ...batchQuery.slice(1)])
    .then((data) => Object.assign(
      optionsValues,
      Object.fromEntries(userOptions.map((opt, i) => [opt, data[i]])))
    )
    .catch((err) => {
      console.error(err);
      return optionsValues
    })
}

export async function postOption(action: UserAction, resource: AppOptionsType, data: Record<string, FormDataEntryValue>[]) {
  const table = TABLE_MAPS[resource];
  const controller = new TableOptionsController(table);
  if (action === 'create') {
    return await controller.createOptions(data);
  } else if (action === 'update') {
    return await controller.updateOptions(data);
  }
}

export const clientRoles = new TableOptionsController<typeof tblRoles>(tblRoles);
export const clientDepartments = new TableOptionsController<typeof tblDepartments>(tblDepartments);
export const clientJobs = new TableOptionsController<typeof tblJobs>(tblJobs);
export const clientTimeEvents = new TableOptionsController<typeof tblTimeEvents>(tblTimeEvents);
