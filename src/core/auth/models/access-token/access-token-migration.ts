import AccessTokenBluePrint from "./access-token-blueprint";

export async function accessTokenMigration() {
  await AccessTokenBluePrint.unique("token");
}
