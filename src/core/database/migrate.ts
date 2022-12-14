import { capitalize } from "@mongez/reinforcements";
import chalk from "chalk";
import { BluePrint, onceConnected } from "core/database";
import dayjs from "dayjs";
import migrationOffice from "./model/migration-office";

let currentMigrations: any[] = [];

export default function migrate(fresh = false) {
  onceConnected(() => startMigrating(fresh));
}

export function setMigrationsList(migrations: any[]) {
  currentMigrations = migrations;
}

export function listMigrations() {
  onceConnected(async () => {
    console.log(
      chalk.blue("→"),
      chalk.cyan("[migration]"),
      chalk.yellow('"Listing all migrations"'),
    );

    const migrations = await migrationOffice.list();

    const blueprints: typeof BluePrint[] = [];

    for (const migration of currentMigrations) {
      if (!migration.blueprint || blueprints.includes(migration.blueprint))
        continue;

      blueprints.push(migration.blueprint);
    }

    for (const blueprint of blueprints) {
      console.log(await blueprint.listIndexes());
    }

    if (!migrations.length) {
      console.log(
        // exclamation mark
        chalk.yellow("⚠"),
        chalk.cyan("[migration]"),
        "No migrations found",
      );
    }

    for (const migration of migrations) {
      console.log(
        // add green check mark
        chalk.green("✓"),
        chalk.cyan("[migration]"),
        chalk.magentaBright(
          dayjs(migration.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        ),
        chalk.greenBright(migration.name),
      );
    }

    process.exit();
  });
}

export function getMigrationName(migration: any) {
  let migrationName = migration;

  migrationName = migrationName.replace(
    new RegExp(`migrations|migration`, "i"),
    "",
  );

  // migration name can be something like usersGroupMigration
  // so we need to split it using camel case
  migrationName = migrationName.replace(/([A-Z])/g, " $1");

  // now capitalize the first letter of each word
  migrationName = capitalize(migrationName);

  return migrationName;
}

export async function dropMigrations() {
  for (const migration of currentMigrations) {
    const migrationName = getMigrationName(migration.name);

    console.log(
      chalk.blue("→"),
      chalk.cyan("[migration]"),
      chalk.gray("[dropping]"),
      chalk.red("Dropping"),
      chalk.yellowBright(`${migrationName} migration`),
    );
    try {
      await migrationOffice.dropMigration(migrationName);

      await migration.down();

      console.log(
        chalk.green("✓"),
        chalk.cyan("[migration]"),
        chalk.gray("[dropped]"),
        chalk.redBright("Dropped"),
        chalk.greenBright(`${migrationName} migration`),
      );
    } catch (error: any) {
      console.log(
        chalk.red("✗"),
        chalk.cyan("[migration]"),
        chalk.gray("[dropFailed]"),
        chalk.redBright("Failed to drop"),
        chalk.greenBright(`${migrationName} migration`),
      );

      console.log(error.message);
    }
  }
}

export async function startMigrating(fresh = false) {
  if (fresh) {
    await dropMigrations();
  }

  for (const migration of currentMigrations) {
    const migrationName = getMigrationName(migration.name);

    console.log(
      // add blue arrow mark
      chalk.blue("→"),
      chalk.cyan("[migration]"),
      chalk.gray("[migrating]"),
      "Creating " + chalk.yellowBright(`${migrationName} migration`),
    );

    try {
      const isMigrated = await migrationOffice.isMigrated(migrationName);

      if (isMigrated) {
        console.log(
          // add red x mark
          chalk.red("✗"),
          chalk.cyan("[migration]"),
          chalk.gray("[skipped]"),
          `${chalk.redBright(
            migrationName + " Migration",
          )} has been done before.`,
        );
        continue;
      }

      await migration();

      await migrationOffice.migrate(migrationName);
      console.log(
        // add green check mark
        chalk.green("✓"),
        chalk.cyan("[migration]"),
        chalk.gray("[migrated]"),
        `${chalk.greenBright(
          migrationName + " Migration",
        )} has been migrated successfully.`,
      );
    } catch (error) {
      console.log(error);
    }
  }

  process.exit(0);
}
