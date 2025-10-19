import { z } from "zod"
export const usersFilterSchema = z.object({
  search: z.coerce.string(),
  role: z.preprocess((v) => typeof v === 'string' ? v.split(",") : v, z.array(z.coerce.number())).default([]),
  department: z.preprocess((v) => typeof v === 'string' ? v.split(",") : v, z.array(z.coerce.number())).default([]),
  job: z.preprocess((v) => typeof v === 'string' ? v.split(",") : v, z.array(z.coerce.number())).default([]),
  supervisor: z.preprocess((v) => typeof v === 'string' ? v.split(",") : v, z.array(z.coerce.number())).default([]),
  active: z.preprocess((v) => typeof v === 'string' ? (v === 'false' ? false : true) : v, z.coerce.boolean()),
  limit: z.coerce.number().default(25)
}).partial();

export type UsersDataFilter = z.infer<typeof usersFilterSchema>;