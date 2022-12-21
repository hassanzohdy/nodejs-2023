import Resource from "core/resources/resource";
import { Collection } from "mongodb";
import connection, { Connection } from "../connection";
import { Database } from "../database";
import masterMind from "./master-mind";
import Model from "./model";
import { Document } from "./types";

export default abstract class BaseModel {
  /**
   * Collection Name
   */
  public static collection = "";

  /**
   * Connection instance
   */
  public static connection: Connection = connection;

  /**
   * Model associated resource
   */
  public static resource?: typeof Resource;

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
   * Get collection query
   */
  public static query() {
    return this.connection.database.collection(this.collection);
  }

  /**
   * Generate next id
   */
  public static async generateNextId() {
    return await masterMind.generateNextId(
      this.collection,
      this.incrementIdBy,
      this.initialId,
    );
  }

  /**
   * Get last id of current model
   */
  public static async getLastId() {
    return await masterMind.getLastId(this.collection);
  }

  /**
   * Get an instance of child class
   */
  protected static self(data: Document) {
    return new (this as any)(data);
  }

  /**
   * Get collection name
   */
  public getCollection(): string {
    return this.getStaticProperty("collection");
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

  /**
   * Prepare model for response
   */
  public async toJSON() {
    // get static resource class
    const resource = this.getStaticProperty("resource");

    // if the model has a resource class
    if (resource) {
      // then return the resource instance and call `toJSON` method
      return await new resource(this).toJSON();
    }

    // otherwise return the data object
    return (this as any).data;
  }
}
