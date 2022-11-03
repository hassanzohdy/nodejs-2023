import { Collection } from "mongodb";
import connection, { Connection } from "../connection";
import { Database } from "../database";

export default abstract class Model {
  /**
   * Collection Name
   */
  public static collectionName = "";

  /**
   * Connection instance
   */
  public static connection: Connection = connection;

  /**
   * Get collection query
   */
  public static query() {
    return this.connection.database.collection(this.collectionName);
  }

  /**
   * Get collection name
   */
  public getCollectionName(): string {
    return this.getStaticProperty("collectionName");
  }

  /**
   * Get collection query
   */
  public getQuery(): Collection {
    return this.getStaticProperty("query")();
  }

  /**
   * Get connection instance
   */
  public getConnection(): Connection {
    return this.getStaticProperty("connection");
  }

  /**
   * Get database instance
   */
  public getDatabase(): Database {
    return this.getConnection().database;
  }

  /**
   * Get static property
   */
  protected getStaticProperty(property: keyof typeof Model) {
    return (this.constructor as any)[property];
  }
}
