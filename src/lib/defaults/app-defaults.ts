export const APP_RESOURCES = ["profile", "entries", "timesheets", "settings.options", "users", "register"] as const;
export const APP_TABLES = ['users', 'roles', 'jobs', 'departments', 'resources', 'roles', 'time_events'] as const;
export const USER_ACTION = ["create", "read", "update", "delete"] as const;
export const APP_OPTIONS = ['jobs' , 'departments' , 'roles' , 'time_events'] as const

//DICEBREAR LINK FOR AVATAR
export const AVATAR_SRC = 'https://api.dicebear.com/9.x/initials/svg?seed=Jessica&radius=50&fontWeight=900';