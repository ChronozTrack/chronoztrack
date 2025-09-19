import { db } from "$lib/server/db";
import { tblUsers } from "$lib/server/db/schema";
import type { UsersDataFilter } from "$lib/data-utils/data-schema";

class UsersController<T extends typeof tblUsers> {
  #db: typeof db = db;
  #tbl: typeof tblUsers = tblUsers;

  constructor(){}

  get client() {
    return this.#db;
  }

  public async selectUser(userId: number){
    return {
      rows: await db.query.tblUsers.findFirst({
        where: (user, {eq, and}) => and(eq(user.id, userId), eq(user.active, true))
      })
    }
  }

  public async selectMany(filters: UsersDataFilter = {}){
    return {
      rows: await db.query.tblUsers.findMany({
        where: (user, {eq}) => eq(user.active, true),
        columns: {passwordHash: false, roleId: false, supervisorId: false},
        with: {
          role: {columns: {id: true, code: true, name: true}},
          supervisor: {columns: {id: true, name: true}},
          designations: {
            where: (designation, {eq}) => eq(designation.active, true),
            columns: {id: true, active: true, createdAt: true},
            with: {
              department: true,
              job: true
            }
          }
        }
      })
    }
  }
}

export const usersController = new UsersController();