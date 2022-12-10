import { userMigrations } from "app/users/models/user";
import { usersGroupMigration } from "app/users/models/usersGroup";
import { accessTokenMigration } from "core/auth/models/access-token";
import { migrate } from "core/database";
import "./config";

const migrationsList = [
  userMigrations,
  usersGroupMigration,
  accessTokenMigration,
];

migrate(migrationsList);
