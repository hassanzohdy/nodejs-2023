import chalk from "chalk";
import connection, { Connection } from "../connection";
import queryBuilder from "../query-builder/query-builder";

export class MigrationOffice {
  /**
   * Master Mind Collection name
   */
  public collectionName = "migrations";

  /**
   * Connection Instance
   */
  protected connection: Connection = connection;

  /**
   * Check if the given migration name is already migrated
   */
  public async isMigrated(migrationName: string): Promise<boolean> {
    const migrationDocument = await queryBuilder.first(this.collectionName, {
      name: migrationName,
    });

    return !!migrationDocument;
  }

  /**
   * Migrate the given migration name
   */
  public async migrate(migrationName: string) {
    await queryBuilder.create(this.collectionName, {
      name: migrationName,
      createdAt: new Date(),
    });
  }

  /**
   * Drop all migrations
   */
  public async drop() {
    console.log(
      chalk.blue("→"),
      chalk.cyan("[migration]"),
      chalk.redBright("Dropping"),
      "all migrations",
    );

    await queryBuilder.delete(this.collectionName);

    console.log(
      chalk.green("✓"),
      chalk.cyan("[migration]"),
      "All migrations has been " + chalk.greenBright("dropped successfully."),
    );
  }

  /**
   * Drop the given migration name
   */
  public async dropMigration(migrationName: string) {
    await queryBuilder.delete(this.collectionName, {
      name: migrationName,
    });
  }

  /**
   * Get migrations list
   */
  public async list() {
    return await queryBuilder.list(this.collectionName);
  }
}

const migrationOffice = new MigrationOffice();

export default migrationOffice;
