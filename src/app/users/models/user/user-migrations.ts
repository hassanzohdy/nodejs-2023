import UserBluePrint from "./user-blueprint";

export async function userMigrations() {
  await UserBluePrint.unique("id");
  await UserBluePrint.unique("email");
}
