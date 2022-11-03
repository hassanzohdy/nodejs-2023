import { Collection } from "mongodb";
import connection, { Connection } from "../connection";
import { Database } from "../database";

type BaseModel<T> = typeof Model & (new () => T);

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
   * Constructor
   */
  public constructor(public data: Record<string, any> = {}) {
    //
  }

  /**
   * Get collection query
   */
  public static query() {
    return this.connection.database.collection(this.collectionName);
  }

  /**
   * Create a new record in the database for the current model (child class of this one)
   * and return a new instance of it with the created data and the new generated id
   */
  public static async create<T>(
    this: BaseModel<T>,
    data: Record<string, any>,
  ): Promise<T> {
    // 1- get the query of the collection
    const query = this.query();

    // perform the insertion
    const result = await query.insertOne(data);

    const modelData = { ...data };

    modelData._id = result.insertedId;

    return this.self(modelData);
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
