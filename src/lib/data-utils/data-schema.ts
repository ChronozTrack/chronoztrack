import { z } from "zod"

const commaSplit = (v: unknown) => typeof v === 'string' ? v.split(","): v
export const usersFilterSchema = z.object({
  search: z.coerce.string(),
  role: z.preprocess(commaSplit, z.array(z.coerce.number())).default([]),
  department: z.preprocess(commaSplit, z.array(z.coerce.number())).default([]),
  job: z.preprocess(commaSplit, z.array(z.coerce.number())).default([]),
  supervisor: z.preprocess(commaSplit, z.array(z.coerce.number())).default([]),
  active: z.preprocess((v) => typeof v === 'string' ? (v === 'false' ? false : true) : v, z.coerce.boolean()),
  pageKeys: z.preprocess(commaSplit, z.array(z.coerce.number())).default([]),
  pageQuery: z.coerce.number().default(1),
  limit: z.coerce.number().default(25)
}).partial();

export type UsersDataFilter = z.infer<typeof usersFilterSchema>;