-- Custom SQL migration file, put your code below! --
INSERT INTO "roles" ("code","name","locked") VALUES 
  ('admin', 'Administrator', true),
  ('editor', 'Editor', true),
  ('user', 'User', true);
--> statement-breakpoint

INSERT INTO "resources" ("code","name","description") VALUES
  ('profile', "Profile", "Access Profile Page"),
  ('user', "User", "Access own info"),
  ('users_list', "Users List", "Access list of users"),
  ('settings', "Settings", "Access App settings"),
  ('entries', "Entries", "Access time entries"),
  ('timesheets', "Timesheets", "View timesheets"),
  ('timesheets_list', "Timesheets List", "View others timesheets");
--> statement-breakpoint

INSERT INTO "role_permissions" ("role_id","resource_id","can_create","can_read","can_update","can_delete") VALUES
  (1,1,true,true,true,true),
  (1,2,true,true,true,true),
  (1,3,true,true,true,true),
  (1,4,true,true,true,true),
  (1,5,true,true,true,true),
  (1,6,true,true,true,true),
  (1,7,true,true,true,true);

--> statement-breakpoint

INSERT INTO "users" ("id", "name", "role_id", "password_hash")
VALUES (100000, "Super Admin", 1, '$argon2id$v=19$m=4096,t=3,p=1$CRBu7CMkaQBxJXkpqWjDAg$Saih8OxuU6k62uhrLHv8C2y/3+88L3XRWBkZE59r1X4');