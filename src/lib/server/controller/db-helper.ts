import type { OptionsCore, TableOptionsType, AppOptionsType, AppTableType, SupervisorListCore } from "$lib/app-types";
import type { BatchItem } from "drizzle-orm/batch";
import { SUPERVISOR_MIN_RESOURCE } from '$lib/defaults/app-defaults';
import { eq, inArray, and, type SQL, notInArray, ne, exists } from "drizzle-orm";
import { tblDepartments, tblJobs, tblRolePermissions, tblRoles, tblTimeEvents, tblUsers } from "$lib/server/db/schema";
import { db } from "../db";

type FilterOptions = {
  type: 'include' | 'exclude' | "*";
  ids?: number[];
  active?: boolean | null;
}
type QueryOptions = Partial<Record<AppOptionsType, FilterOptions>>

type QueryOptionsResults = Record<AppOptionsType, OptionsCore[]>
type QuerySupervisorsResults = {
  id: number;
  name: string;
  designations?: {
    id: number,
    name: string,
    active: boolean
  }[]
}

const TABLE_MAPS: Record<AppOptionsType, TableOptionsType> = {
  jobs: tblJobs,
  departments: tblDepartments,
  roles: tblRoles,
  time_events: tblTimeEvents
};

export async function queryOptions(options: QueryOptions) {
  let optionsValue = {
    departments: [],
    roles: [],
    jobs: [],
    time_events: [],
  }

  let queryOrderKey: AppTableType[] = []
  const queryOptions: BatchItem<"sqlite">[] = [];

  Object.entries(options).forEach(([tblName, filters]) => {
    const table = TABLE_MAPS[tblName as AppOptionsType];
    const query = queryOptionTable(table, filters)
    if (query) {
      queryOptions.push(query)
      queryOrderKey.push(tblName as AppTableType)
    }
  })

  const results = await db
    .batch([queryOptions[0], ...queryOptions.slice(1)])
    .then(data => Object.assign(
      optionsValue,
      Object.fromEntries(queryOrderKey.map((k, i) => [k, data[i]])))
    ) as QueryOptionsResults
  return results
}


function parseFilterOptions<T extends TableOptionsType>(tbl: T, { type, ids, active }: FilterOptions) {
  const filters: SQL[] = [eq(tbl.active, active ?? true)]
  if (!ids || !ids.length) {
    return null;
  } else if (type === 'include') {
    if (ids.length === 1) {
      filters.push(eq(tbl.id, ids[0]))
    } else {
      filters.push(inArray(tbl.id, ids))
    }
  } else {
    if (ids.length === 1) {
      filters.push(ne(tbl.id, ids[0]))
    } else {
      filters.push(notInArray(tbl.id, ids))
    }
  }

  return and(...filters)
}

function queryOptionTable<T extends TableOptionsType>(tbl: T, filters: FilterOptions) {
  const query = db.select({ id: tbl.id, code: tbl.code, name: tbl.name }).from(tbl).$dynamic()
  if (filters.type === "*") {
    if (typeof filters.active === 'boolean') {
      return query.where(eq(tbl.active, filters.active))
    } else {
      return query
    }
  } else {
    const sqlCondition = parseFilterOptions(tbl, filters);
    if (!sqlCondition) return null

    return query.where(sqlCondition)
  }
}

export async function querySupervisors(withDesignation: boolean = false): Promise<SupervisorListCore[]> {
  return await db.query.tblUsers.findMany({
    columns: { id: true, name: true, active: true },
    where: (users, { and, eq, exists }) =>
      and(
        eq(users.active, true),
        exists(
          db.select({ roleId: tblRolePermissions.roleId })
            .from(tblRolePermissions)
            .where(
              and(
                inArray(tblRolePermissions.resourceId, SUPERVISOR_MIN_RESOURCE),
                eq(tblRolePermissions.roleId, users.roleId)
              )
            )
        )
      ),
    with: !withDesignation ? undefined : {
      designations: {
        columns: { id: true, active: true, createdAt: true },
        orderBy: (designation, { desc }) => desc(designation.createdAt),
        limit: 1,
        with: {
          department: {
            columns: { id: true, code: true, name: true, active: true },
          }
        }
      }
    }
  }
  )
}