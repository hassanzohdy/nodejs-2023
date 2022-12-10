import UsersGroupBluePrint from "./users-group-blueprint";

export async function usersGroupMigration() {
  await UsersGroupBluePrint.unique("id");
}
