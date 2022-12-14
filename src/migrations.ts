import "core/bootstrap";

import { userLocationMigrations, userMigrations } from "app/users/models/user";
import { usersGroupMigration } from "app/users/models/usersGroup";
import { accessTokenMigration } from "core/auth/models/access-token";
import { listDatabaseIndexes, migrate } from "core/database";
import { listMigrations, setMigrationsList } from "core/database/migrate";
import "./config";

const migrationsList = [
  userMigrations,
  userLocationMigrations,
  usersGroupMigration,
  accessTokenMigration,
];

setMigrationsList(migrationsList);

// list migrations flag
if (process.argv.includes("--list")) {
  listMigrations();
} else if (process.argv.includes("--indexes")) {
  listDatabaseIndexes();
} else {
  const freshMigration = process.argv.includes("--fresh");
  migrate(freshMigration);
}
