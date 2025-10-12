-- Custom SQL migration file, put your code below! --
-- ========================
-- Timestamp for every users update
-- ========================
CREATE TRIGGER IF NOT EXISTS users_updated 
AFTER UPDATE ON users WHEN old.updated_at <> CURRENT_TIMESTAMP
BEGIN
 UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;
--> statement-breakpoint

-- ========================
-- USERS Table Logs
-- ========================
CREATE TRIGGER IF NOT EXISTS users_update_audit
BEFORE UPDATE ON users
WHEN 
  OLD.active IS NOT NEW.active OR
  OLD.name IS NOT NEW.name OR
  OLD.role_id IS NOT NEW.role_id OR
  OLD.supervisor_id IS NOT NEW.supervisor_id OR
  OLD.lock_password IS NOT NEW.lock_password OR
  OLD.modified_by IS NOT NEW.modified_by
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, modified_by, row_data)
  VALUES (
    'users',
    OLD.id,
    'UPDATE',
    NEW.modified_by,
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'name', OLD.name,
      'role_id', OLD.role_id,
      'supervisor_id', OLD.supervisor_id,
      'lock_password', OLD.lock_password,
      'created_at', OLD.created_at,
      'modified_by', OLD.modified_by,
      'updated_at', OLD.updated_at
    )
  );
END;
--> statement-breakpoint

CREATE TRIGGER IF NOT EXISTS users_delete_audit
BEFORE DELETE ON users
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, modified_by, row_data)
  VALUES (
    'users',
    OLD.id,
    'DELETE',
    OLD.modified_by,
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'name', OLD.name,
      'role_id', OLD.role_id,
      'password_hash', OLD.password_hash,
      'supervisor_id', OLD.supervisor_id,
      'lock_password', OLD.lock_password,
      'preferences', OLD.preferences,
      'created_at', OLD.created_at,
      'modified_by', OLD.modified_by,
      'updated_at', OLD.updated_at
    )
  );
END;
--> statement-breakpoint

-- ===================================
-- TIME_EVENTS UPDATE Table Logs
-- ===================================
CREATE TRIGGER IF NOT EXISTS time_events_update_audit
BEFORE UPDATE ON time_events
WHEN 
  OLD.active IS NOT NEW.active OR
  OLD.name IS NOT NEW.name OR
  OLD.code IS NOT NEW.code OR
  OLD.description IS NOT NEW.description OR
  OLD.locked IS NOT NEW.locked OR
  OLD.modified_by IS NOT NEW.modified_by
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, modified_by, row_data)
  VALUES (
    'time_events',
    OLD.id,
    'UPDATE',
    NEW.modified_by,
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'code', OLD.code,
      'name', OLD.name,
      'description', OLD.description,
      'locked', OLD.locked,
      'modified_by', OLD.modified_by
    )
  );
END;
--> statement-breakpoint

-- ===================================
-- TIME_EVENTS DELETE Table Logs
-- ===================================
CREATE TRIGGER IF NOT EXISTS time_events_delete_audit
BEFORE DELETE ON time_events
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, row_data)
  VALUES (
    'time_events',
    OLD.id,
    'DELETE',
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'code', OLD.code,
      'name', OLD.name,
      'description', OLD.description,
      'locked', OLD.locked,
      'modified_by', OLD.modified_by
    )
  );
END;
--> statement-breakpoint

-- ===================================
-- DEPARTMENTS UPDATE Table Logs
-- ===================================
CREATE TRIGGER IF NOT EXISTS departments_update_audit
BEFORE UPDATE ON departments
WHEN 
  OLD.active IS NOT NEW.active OR
  OLD.name IS NOT NEW.name OR
  OLD.code IS NOT NEW.code OR
  OLD.description IS NOT NEW.description OR
  OLD.locked IS NOT NEW.locked OR
  OLD.modified_by IS NOT NEW.modified_by
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, modified_by, row_data)
  VALUES (
    'departments',
    OLD.id,
    'UPDATE',
    NEW.modified_by,
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'code', OLD.code,
      'name', OLD.name,
      'description', OLD.description,
      'locked', OLD.locked,
      'modified_by', OLD.modified_by
    )
  );
END;
--> statement-breakpoint

-- ===================================
-- DEPARTMENTS DELETE Table Logs
-- ===================================
CREATE TRIGGER IF NOT EXISTS departments_delete_audit
BEFORE DELETE ON departments
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, row_data)
  VALUES (
    'departments',
    OLD.id,
    'DELETE',
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'code', OLD.code,
      'name', OLD.name,
      'description', OLD.description,
      'locked', OLD.locked,
      'modified_by', OLD.modified_by
    )
  );
END;
--> statement-breakpoint

-- ===================================
-- JOBS UPDATE Table Logs
-- ===================================
CREATE TRIGGER IF NOT EXISTS jobs_update_audit
BEFORE UPDATE ON jobs
WHEN 
  OLD.active IS NOT NEW.active OR
  OLD.name IS NOT NEW.name OR
  OLD.code IS NOT NEW.code OR
  OLD.description IS NOT NEW.description OR
  OLD.locked IS NOT NEW.locked OR
  OLD.modified_by IS NOT NEW.modified_by
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, modified_by, row_data)
  VALUES (
    'jobs',
    OLD.id,
    'UPDATE',
    NEW.modified_by,
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'code', OLD.code,
      'name', OLD.name,
      'description', OLD.description,
      'locked', OLD.locked,
      'modified_by', OLD.modified_by
    )
  );
END;
--> statement-breakpoint

-- ===================================
-- JOBS DELETE Table Logs
-- ===================================
CREATE TRIGGER IF NOT EXISTS jobs_delete_audit
BEFORE DELETE ON jobs
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, row_data)
  VALUES (
    'jobs',
    OLD.id,
    'DELETE',
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'code', OLD.code,
      'name', OLD.name,
      'description', OLD.description,
      'locked', OLD.locked,
      'modified_by', OLD.modified_by
    )
  );
END;
--> statement-breakpoint

-- ===================================
-- ROLES UPDATE Table Logs
-- ===================================
CREATE TRIGGER IF NOT EXISTS roles_update_audit
BEFORE UPDATE ON roles
WHEN 
  OLD.active IS NOT NEW.active OR
  OLD.name IS NOT NEW.name OR
  OLD.code IS NOT NEW.code OR
  OLD.description IS NOT NEW.description OR
  OLD.locked IS NOT NEW.locked OR
  OLD.modified_by IS NOT NEW.modified_by
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, modified_by, row_data)
  VALUES (
    'roles',
    OLD.id,
    'UPDATE',
    NEW.modified_by,
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'code', OLD.code,
      'name', OLD.name,
      'description', OLD.description,
      'locked', OLD.locked,
      'modified_by', OLD.modified_by
    )
  );
END;
--> statement-breakpoint

-- ===================================
-- ROLES DELETE Table Logs
-- ===================================
CREATE TRIGGER IF NOT EXISTS roles_delete_audit
BEFORE DELETE ON roles
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, row_data)
  VALUES (
    'roles',
    OLD.id,
    'DELETE',
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'code', OLD.code,
      'name', OLD.name,
      'description', OLD.description,
      'locked', OLD.locked,
      'modified_by', OLD.modified_by
    )
  );
END;
--> statement-breakpoint

-- ===================================
-- RESOURCES UPDATE Table Logs
-- ===================================
CREATE TRIGGER IF NOT EXISTS resources_update_audit
BEFORE UPDATE ON resources
WHEN 
  OLD.active IS NOT NEW.active OR
  OLD.name IS NOT NEW.name OR
  OLD.code IS NOT NEW.code OR
  OLD.description IS NOT NEW.description OR
  OLD.locked IS NOT NEW.locked OR
  OLD.modified_by IS NOT NEW.modified_by
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, modified_by, row_data)
  VALUES (
    'resources',
    OLD.id,
    'UPDATE',
    NEW.modified_by,
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'code', OLD.code,
      'name', OLD.name,
      'description', OLD.description,
      'locked', OLD.locked,
      'modified_by', OLD.modified_by
    )
  );
END;
--> statement-breakpoint

-- ===================================
-- RESOURCES DELETE Table Logs
-- ===================================
CREATE TRIGGER IF NOT EXISTS resources_delete_audit
BEFORE DELETE ON resources
BEGIN
  INSERT INTO table_logs (table_name, row_id, operation, row_data)
  VALUES (
    'resources',
    OLD.id,
    'DELETE',
    json_object(
      'id', OLD.id,
      'active', OLD.active,
      'code', OLD.code,
      'name', OLD.name,
      'description', OLD.description,
      'locked', OLD.locked,
      'modified_by', OLD.modified_by
    )
  );
END;
--> statement-breakpoint

-- ========================
-- Timestamp for every time_entries updates
-- ========================
CREATE TRIGGER IF NOT EXISTS time_entries_updated 
AFTER UPDATE ON time_entries WHEN old.updated_at <> CURRENT_TIMESTAMP
BEGIN
 UPDATE time_entries SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;
--> statement-breakpoint

-- ========================
-- Table: users fts5
-- ========================
-- Create a table. And an external content fts5 table to index it.
CREATE VIRTUAL
TABLE fts_users USING fts5 (
    name,
    tokenize = 'trigram',
    content = 'users',
    content_rowid = 'id'
);
--> statement-breakpoint

-- Triggers to keep the FTS index up to date.
CREATE TRIGGER fts_user_insert AFTER INSERT ON users BEGIN
  INSERT INTO fts_users(rowid, name) VALUES (new.id, new.name);
END;
--> statement-breakpoint

CREATE TRIGGER fts_user_delete AFTER DELETE ON users BEGIN
  INSERT INTO fts_users(fts_users, rowid, name) VALUES('delete', old.id, old.name);
END;
--> statement-breakpoint

CREATE TRIGGER fts_user_update AFTER UPDATE ON users WHEN old.name <> new.name
BEGIN 
  INSERT INTO fts_users(fts_users, rowid, name) VALUES('delete', old.id, old.name);
  INSERT INTO fts_users(rowid, name) VALUES (new.id, new.name);
END;