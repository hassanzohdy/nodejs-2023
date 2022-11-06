import { Collection } from "mongodb";
import connection, { Connection } from "../connection";
import { Database } from "../database";
import masterMind from "./master-mind";
import Model from "./model";
import { ModelDocument } from "./types";

export default abstract class BaseModel {
  /**
   * Collection Name
   */
  public static collectionName = "";

  /**
   * Connection instance
   */
  public static connection: Connection = connection;

  /**
   * Define the initial value of the id
   */
  public static initialId = 1;

  /**
   * Define the amount to eb incremented by for the next generated id
   */
  public static incrementIdBy = 1;

  /**
   * Primary id column
   */
  public static primaryIdColumn = "id";

  /**
   * Constructor
   */
  public constructor(public data: Partial<ModelDocument> = {}) {
    //
  }

  /**
   * Get collection query
   */
  public static query() {
    return this.connection.database.collection(this.collectionName);
  }

  /**
   * Generate next id
   */
  public static async generateNextId() {
    return await masterMind.generateNextId(
      this.collectionName,
      this.incrementIdBy,
      this.initialId,
    );
  }

  /**
   * Get last id of current model
   */
  public static async getLastId() {
    return await masterMind.getLastId(this.collectionName);
  }

  /**
   * Get an instance of child class
   */
  protected static self(data: Record<string, any>) {
    return new (this as any)(data);
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
