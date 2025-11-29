import { usersFilterSchema, type UsersDataFilter } from "$lib/data-utils/data-schema";
import type { SvelteFetch, UsersData, UserTablesCore } from "$lib/app-types";
import { type RawFormDataShape, getDateFormat } from "$lib/utils";
import type { Operators, Simplify, SQL, TableRelationalConfig } from "drizzle-orm"
import { db } from "$lib/server/db";
import { desc } from "drizzle-orm";
import { createSchemaFactory } from "drizzle-zod";
import { tblUserDesignation, tblUsers, tblUserSchedule } from "$lib/server/db/schema";
import { hashPassword } from "./auth";
import { APP_DOMAIN, DEFAULT_ROLE } from "$lib/defaults/app-defaults";
import type { ZodError } from "zod";

type RltUser = typeof tblUsers & TableRelationalConfig;

const { createInsertSchema } = createSchemaFactory({ coerce: true });

class UsersController {
  #db: typeof db = db;
  #tblUser: typeof tblUsers = tblUsers;
  #tblSchedule: typeof tblUserSchedule = tblUserSchedule;
  #tblDesignation: typeof tblUserDesignation = tblUserDesignation;

  constructor() { }

  get client() {
    return this.#db;
  }

  public async create(fetch: SvelteFetch, formData: RawFormDataShape<UserTablesCore>) {
    const { user, user_designation, user_schedule } = formData;
    const userDefault = await this.#setUsersDefaults(fetch, Number(user.id));
    Object.assign(user, userDefault);

    const validUser = createInsertSchema(this.#tblUser).safeParse(user);
    const validDesignation = createInsertSchema(this.#tblDesignation).omit({ id: true }).safeParse(user_designation);
    const validSchedule = createInsertSchema(this.#tblSchedule).omit({ id: true }).safeParse(user_schedule);

    if (!validUser.success || !validDesignation.success || !validSchedule.success) {
      return {
        user: validUser.error,
        user_designation: validDesignation.error,
        user_schedule: validSchedule.error
      }
    }

    return await this.#db.transaction(async (tx) => {
      const user = await tx.insert(this.#tblUser).values(validUser.data).returning({ id: this.#tblUser.id, name: this.#tblUser.name });
      await tx.insert(this.#tblDesignation).values(validDesignation.data);
      await tx.insert(this.#tblSchedule).values(validSchedule.data);
      return user
    }, {
      behavior: 'immediate'
    })
  }

  public async selectUser(userId: number) {
    return {
      rows: await db.query.tblUsers.findFirst({
        where: (user, { eq, and }) => and(eq(user.id, userId), eq(user.active, true))
      })
    }
  }

  public async selectMany(filters: UsersDataFilter): Promise<
    | { rows: UsersData[]; error?: never }
    | { rows?: never; error: ZodError<UsersDataFilter> }
  > {
    const validFilters = usersFilterSchema.safeParse(filters);
    if (!validFilters.success) {
      return {
        error: validFilters.error
      }
    }
    console.log(validFilters.data)
    return {
      rows: await db.query.tblUsers.findMany({
        columns: { passwordHash: false, roleId: false, supervisorId: false },
        with: {
          role: { columns: { id: true, code: true, name: true } },
          supervisor: { columns: { id: true, name: true } },
          designations: {
            columns: { id: true, active: true, createdAt: true },
            with: {
              department: {
                columns: { id: true, code: true, name: true, active: true }
              },
              job: {
                columns: { id: true, code: true, name: true, active: true }
              }
            }
          },
          schedules: {
            where: (schedules, { lte }) => lte(schedules.startDate, getDateFormat(new Date())),
            orderBy: [desc(this.#tblSchedule.startDate)],
            limit: 1,
          }
        },
        where: (user, operators) => this.#sqlFilter(user, operators, validFilters.data),
        orderBy: (user, { asc }) => asc(user.id),
        limit: validFilters.data.limit
      })
    }
  }

  #sqlFilter(
    user: Simplify<[RltUser['columns']] extends [never] ? {} : RltUser['columns']>,
    operators: Operators,
    filters: UsersDataFilter
  ) {
    const sqlExistArr: SQL[] = [];
    const sqlArr: SQL[] = []
    const { department = [], job = [], role = [], supervisor = [], active, indexKey } = filters || {}
    const { eq, and, exists, inArray, gt } = operators;
    if (department.length) {
      if (department.length === 1) {
        sqlExistArr.push(eq(this.#tblDesignation.departmentId, department[0]));
      } else {
        sqlExistArr.push(inArray(this.#tblDesignation.departmentId, department));
      }
    }

    if (job.length) {
      if (job.length === 1) {
        sqlExistArr.push(eq(this.#tblDesignation.jobId, job[0]));
      } else {
        sqlExistArr.push(inArray(this.#tblDesignation.jobId, job));
      }
    }

    if (sqlExistArr.length) {
      sqlExistArr.push(eq(this.#tblDesignation.userId, user.id))
      sqlArr.push(exists(this.#db.select({ id: this.#tblDesignation.id }).from(this.#tblDesignation).where(and(...sqlExistArr))))
    }
    if (role.length) {
      if (role.length === 1) {
        sqlArr.push(eq(user.roleId, role[0]))
      } else {
        sqlArr.push(inArray(user.roleId, role))
      }
    }

    if (supervisor.length) {
      if (supervisor.length === 1) {
        sqlArr.push(eq(user.supervisorId, supervisor[0]))
      } else {
        sqlArr.push(inArray(user.supervisorId, supervisor))
      }
    }

    if(indexKey){
      sqlArr.push(gt(user.name, indexKey))
    }

    if (typeof active === 'boolean') {
      sqlArr.push(eq(user.active, active))
    }

    if (sqlArr.length === 0) return undefined;

    if (sqlArr.length === 1) return sqlArr[0];


    return and(...sqlArr);
  }

  async #setUsersDefaults(fetch: SvelteFetch, userId: number) {
    const { data, error } = await hashPassword(fetch, `${userId}@${String(APP_DOMAIN).toLowerCase()}`);
    if (error || !data) {
      return { user: null, error: { message: 'Failed to hash password, please try again later' } };
    }

    return DEFAULT_ROLE
      ? { passwordHash: data, roleId: DEFAULT_ROLE }
      : { passwordHash: data };
  }
}

export const usersController = new UsersController();