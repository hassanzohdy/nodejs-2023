import UsersGroupBluePrint from "./users-group-blueprint";

export async function usersGroupMigration() {
  await UsersGroupBluePrint.unique("id");
}

usersGroupMigration.down = async () => {
  await UsersGroupBluePrint.dropUniqueIndex("id");
};

usersGroupMigration.blueprint = UsersGroupBluePrint;
