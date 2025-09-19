import type { OptionsCore, TableOptionsType, AppOptionsType, AppTableType } from "$lib/app-types";
import { eq, inArray, and, type SQL, notInArray, getTableName, ne } from "drizzle-orm";
import { tblDepartments, tblJobs, tblRoles, tblTimeEvents } from "$lib/server/db/schema";
import { db } from "../db";
import type { BatchItem } from "drizzle-orm/batch";
import type { APP_OPTIONS } from "$lib/defaults/app-defaults";

type FilterOptions = {
  type: 'include' | 'exclude' | "*";
  ids?: number[];
}
type QueryOptions = Partial<Record<AppOptionsType, FilterOptions>>

type QueryOptionsResults = Record<AppOptionsType, OptionsCore[]>

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
  const { departments, time_events, jobs, roles } = options;
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


function parseFilterOptions<T extends TableOptionsType>(tbl: T, { type, ids }: FilterOptions) {
  const filters: SQL[] = [eq(tbl.active, true)]
  if (type === '*') {
    return filters[0]
  } else if (!ids || !ids.length) {
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
  const sqlCondition = parseFilterOptions(tbl, filters);
  if (!sqlCondition) return null

  return db
    .select({ id: tbl.id, code: tbl.code, name: tbl.name })
    .from(tbl)
    .where(sqlCondition)
}