-- Custom SQL migration file, put your code below! --
-- TIMESTAMP FOR EVERY USER UPDATES
CREATE TRIGGER IF NOT EXISTS users_updated 
AFTER UPDATE ON users WHEN old.updated_at <> CURRENT_TIMESTAMP
BEGIN
 UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;
--> statement-breakpoint

-- Create a table. And an external content fts5 table to index it.
CREATE VIRTUAL TABLE fts_users USING fts5(name, tokenize='trigram', content='users', content_rowid='id' );
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