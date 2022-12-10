import { capitalize } from "@mongez/reinforcements";
import chalk from "chalk";
import { connection, connectToDatabase } from "core/database";
import migrationOffice from "./model/migration-office";

export default function migrate(migrations: any[]) {
  connectToDatabase();
  connection.on("connected", () => startMigrating(migrations));

  if (connection.isConnected()) {
    startMigrating(migrations);
  }
}

export async function startMigrating(migrations: any[]) {
  for (const migration of migrations) {
    let migrationName = migration.name;

    migrationName = migrationName.replace(
      new RegExp(`migrations|migration`, "i"),
      "",
    );

    // migration name can be something like usersGroupMigration
    // so we need to split it using camel case
    migrationName = migrationName.replace(/([A-Z])/g, " $1");

    // now capitalize the first letter of each word
    migrationName = capitalize(migrationName);

    console.log(
      // add blue arrow mark
      chalk.blue("→"),
      chalk.cyan("[migration]"),
      "Creating " + chalk.yellowBright(`${migrationName} migration`),
    );

    migrationOffice.isMigrated(migrationName).then(isMigrated => {
      if (isMigrated) {
        console.log(
          // add red x mark
          chalk.red("✗"),
          chalk.cyan("[migration]"),
          `${chalk.redBright(
            migrationName + "",
          )} Migration is already migrated`,
        );
        return;
      }

      migration().then(() => {
        console.log(
          // add green check mark
          chalk.green("✓"),
          chalk.cyan("[migration]"),
          `${chalk.greenBright(
            migrationName + " Migration",
          )} has been migrated successfully.`,
        );

        migrationOffice.migrate(migrationName);
      });
    });
  }
}
