import { Db } from "mongodb";

export class Database {
  /**
   * MongoDB Internal Database instance
   */
  public database!: Db;

  /**
   * Set database instance
   */
  public setDatabase(database: Db) {
    this.database = database;

    return this;
  }

  /**
   * Get database collection instance
   */
  public collection(collectionName: string) {
    return this.database.collection(collectionName);
  }

  /**
   * List collection names
   */
  public async listCollectionNames() {
    return await (
      await this.database.collections()
    ).map(collection => collection.collectionName);
  }
}

const database = new Database();

export default database;
