import { z } from "zod"
export const usersFilterSchema = z.object({
  search: z.coerce.string(),
  role: z.coerce.number().array().default([]),
  department: z.coerce.number().array().default([]),
  job: z.coerce.number().array().default([]),
  supervisor: z.coerce.number().array().default([]),
  active: z.preprocess((v) => {
    if (typeof v === 'string') {
      return v === 'false' ? false : true;
    }

    return v
  }, z.coerce.boolean())
}).partial();

export type UsersDataFilter = z.infer<typeof usersFilterSchema>;