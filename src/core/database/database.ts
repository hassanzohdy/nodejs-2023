import { Db } from "mongodb";

export class Database {
  /**
   * Database instance
   */
  public database!: Db;

  /**
   * Set database instance
   */
  public setDatabase(database: Db) {
    this.database = database;

    return this;
  }
}

const database = new Database();

export default database;
