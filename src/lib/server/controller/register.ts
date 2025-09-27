import type { TableUsers, TableDesignations, TableSchedules } from "$lib/app-types";
import {ROLES_DEFAULT} from "$lib/defaults/app-defaults";

function addUser(formData:
  {
    users: TableUsers[];
    user_designations: TableDesignations[];
    user_schedules: TableSchedules[];
  }
) {
  let { users, user_designations, user_schedules } = formData;
}

function setUsersDefaults(users: TableUsers){
  users.roleId = ROLES_DEFAULT[0] // user;
  users.passwordHash = '';
}