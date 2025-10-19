import { usersFilterSchema, type UsersDataFilter } from "$lib/data-utils/data-schema";
import type { SvelteFetch, UserTablesCore } from "$lib/app-types";
import { type RawFormDataShape, getDateFormat } from "$lib/utils";
import type { Operators, Simplify, SQL, TableRelationalConfig } from "drizzle-orm"
import { db } from "$lib/server/db";
import { desc } from "drizzle-orm";
import { createSchemaFactory } from "drizzle-zod";
import { tblDepartments, tblUserDesignation, tblUsers, tblUserSchedule } from "$lib/server/db/schema";
import { hashPassword } from "./auth";
import { APP_DOMAIN, DEFAULT_ROLE } from "$lib/defaults/app-defaults";

type RltUserDesignation = typeof tblUserDesignation & TableRelationalConfig;
type RltUserSchedule = typeof tblUserSchedule & TableRelationalConfig;
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

  public async selectMany(filters: Record<string, string | string[]>) {
    const validFilters = usersFilterSchema.safeParse(filters);
    if (!validFilters.success) {
      return {
        error: validFilters.error
      }
    }
    console.log(validFilters.data)
    return {
      rows: await db.query.tblUsers.findMany({
        where: (user, operators) => this.#sqlFilter(user, operators, validFilters.data),
        limit: validFilters.data.limit,
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
          }
        }
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
    const { department = [], job = [], role = [], supervisor = [], active } = filters || {}
    const { eq, and, exists, inArray } = operators;
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

    if (typeof active === 'boolean') {
      sqlArr.push(eq(user.active, active))
    }

    if (sqlArr.length === 0) return undefined;

    if (sqlArr.length === 1) return sqlArr[0];

    return and(...sqlArr);
  }


  #designationFilter(
    fields: Simplify<[RltUserDesignation['columns']] extends [never] ? {} : RltUserDesignation['columns']>,
    operators: Operators,
    filter: { department?: number[], job?: number[] }): SQL | undefined {
    const { department = [], job = [] } = filter || {}
    if (department.length === 0 && job.length === 0) return undefined;

    const { eq, inArray, and } = operators;
    const sqlArr: SQL[] = [];

    if (department.length) {
      if (department.length === 1) {
        sqlArr.push(eq(fields.departmentId, department[0]));
      } else {
        sqlArr.push(inArray(fields.departmentId, department));
      }
    }

    if (job.length) {
      if (job.length === 1) {
        sqlArr.push(eq(fields.jobId, job[0]));
      } else {
        sqlArr.push(inArray(fields.jobId, job));
      }
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