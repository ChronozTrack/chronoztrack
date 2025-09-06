import { relations } from "drizzle-orm";
import {
  tblUsers,
  tblResources,
  tblRolePermissions,
  tblRoles,
  tblSessions,
  tblDepartments,
  tblJobs,
  tblUserSchedule,
  tblUserDesignation
} from "./schema";

export const rltsUser = relations(tblUsers, ({ many, one }) => {
  return {
    role: one(tblRoles, {
      fields: [tblUsers.roleId],
      references: [tblRoles.id]
    }),
    supervisor: one(tblUsers, {
      fields: [tblUsers.supervisorId],
      references: [tblUsers.id]
    }),
    permissions: many(tblRolePermissions),
    designations: many(tblUserDesignation),
    sessions: many(tblSessions),
    schedules: many(tblUserSchedule),
  }
})

export const rltsSession = relations(tblSessions, ({ one }) => {
  return {
    user: one(tblUsers, {
      fields: [tblSessions.userId],
      references: [tblUsers.id]
    })
  }
});

export const rltsPermissions = relations(tblRolePermissions, ({ one }) => {
  return {
    user: one(tblUsers, {
      fields: [tblRolePermissions.roleId],
      references: [tblUsers.roleId]
    }),
    resource: one(tblResources, {
      fields: [tblRolePermissions.resourceId],
      references: [tblResources.id]
    })
  }
})

export const rltUserDesignation = relations(tblUserDesignation, ({ one }) => {
  return {
    user: one(tblUsers, {
      fields: [tblUserDesignation.userId],
      references: [tblUsers.id]
    }),
    department: one(tblDepartments, {
      fields: [tblUserDesignation.departmentId],
      references: [tblDepartments.id]
    }),
    job: one(tblJobs, {
      fields: [tblUserDesignation.jobId],
      references: [tblJobs.id]
    })
  }
})

export const rltsSchedules = relations(tblUserSchedule, ({ one }) => {
  return {
    user: one(tblUsers, {
      fields: [tblUserSchedule.userId],
      references: [tblUsers.id]
    }),
  }
})