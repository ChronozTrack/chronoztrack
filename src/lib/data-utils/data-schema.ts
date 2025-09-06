import { z } from "zod"
export const usersFilterSchema = z.object({
  userId: z.coerce.number(),
  name: z.coerce.string(),
  roleId: z.coerce.number(),
  departmentId: z.coerce.number(),
  jobsId: z.coerce.number(),
  supervisorId: z.coerce.number(),
  active: z.preprocess((v) => {
    if (typeof v === 'string') {
      return v === 'false' ? false : true;
    }

    return v
  }, z.coerce.boolean())
}).partial();

export type UsersDataFilter = z.infer<typeof usersFilterSchema>;