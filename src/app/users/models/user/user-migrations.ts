import UserBluePrint from "./user-blueprint";

export async function userMigrations() {
  await UserBluePrint.unique("id");
  await UserBluePrint.unique("email");
}

userMigrations.blueprint = UserBluePrint;

userMigrations.down = async () => {
  await UserBluePrint.dropUniqueIndex("id");
  await UserBluePrint.dropUniqueIndex("email");
  await UserBluePrint.dropTextIndex("name");
};

export async function userLocationMigrations() {
  await UserBluePrint.geoIndex("location");
}

userLocationMigrations.down = async () => {
  await UserBluePrint.dropGeoIndex("location");
};

userLocationMigrations.blueprint = UserBluePrint;
