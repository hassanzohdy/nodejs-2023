import { Collection, ObjectId } from "mongodb";
import connection, { Connection } from "../connection";
import { Database } from "../database";
import masterMind from "./master-mind";

type BaseModel<T> = typeof Model & (new () => T);

type PrimaryIdType = string | number | ObjectId;

type PaginationListing<T> = {
  documents: T[];
  paginationInfo: {
    limit: number;
    result: number;
    page: number;
    total: number;
    pages: number;
  };
};

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

    const modelData = { ...data };

    modelData.id = await this.generateNextId();

    // perform the insertion
    const result = await query.insertOne(modelData);

    modelData._id = result.insertedId;

    return this.self(modelData);
  }

  /**
   * Update model by the given id
   */
  public static async update<T>(
    this: BaseModel<T>,
    id: PrimaryIdType,
    data: Record<string, any>,
  ): Promise<T> {
    // get the query of the current collection
    const query = this.query();

    // execute the update operation

    const filter = {
      [this.primaryIdColumn]: id,
    };

    const result = await query.findOneAndUpdate(
      filter,
      {
        $set: data,
      },
      {
        returnDocument: "after",
      },
    );

    return this.self(result.value as Record<string, any>);
  }

  /**
   * Replace the entire document for the given document id with the given new data
   */
  public static async replace<T>(
    this: BaseModel<T>,
    id: PrimaryIdType,
    data: Record<string, any>,
  ): Promise<T> {
    const query = this.query();

    const filter = {
      [this.primaryIdColumn]: id,
    };

    const result = await query.findOneAndReplace(filter, data, {
      returnDocument: "after",
    });

    return this.self(result.value as Record<string, any>);
  }

  /**
   * Find and update the document for the given filter with the given data or create a new document/record
   * if filter has no matching
   */
  public static async upsert<T>(
    this: BaseModel<T>,
    filter: Record<string, any>,
    data: Record<string, any>,
  ): Promise<T> {
    // get the query of the current collection
    const query = this.query();

    // execute the update operation
    const result = await query.findOneAndUpdate(
      filter,
      {
        $set: data,
      },
      {
        returnDocument: "after",
        upsert: true,
      },
    );

    return this.self(result.value as Record<string, any>);
  }

  /**
   * Find document by id
   */
  public static async find<T>(this: BaseModel<T>, id: PrimaryIdType) {
    return this.findBy(this.primaryIdColumn, id);
  }

  /**
   * Find document by the given column and value
   */
  public static async findBy<T>(
    this: BaseModel<T>,
    column: string,
    value: any,
  ): Promise<T | null> {
    const query = this.query();

    const result = await query.findOne({
      [column]: value,
    });

    return result ? this.self(result as Record<string, any>) : null;
  }

  /**
   * List multiple documents based on the given filter
   */
  public static async list<T>(
    this: BaseModel<T>,
    filter: Record<string, any> = {},
  ): Promise<T[]> {
    const query = this.query();

    const documents = await query.find(filter).toArray();

    return documents.map(document => this.self(document));
  }

  /**
   * Paginate records based on the given filter
   */
  public static async paginate<T>(
    this: BaseModel<T>,
    filter: Record<string, any>,
    page: number,
    limit: number,
  ): Promise<PaginationListing<T>> {
    const query = this.query();

    const documents = await query
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const totalDocumentsOfFilter = await query.countDocuments(filter);

    const result: PaginationListing<T> = {
      documents: documents.map(document => this.self(document)),
      paginationInfo: {
        limit,
        page,
        result: documents.length,
        total: totalDocumentsOfFilter,
        pages: Math.ceil(totalDocumentsOfFilter / limit),
      },
    };

    return result;
  }

  /**
   * Delete single document if the given filter is an ObjectId of mongodb
   * Otherwise, delete multiple documents based on the given filter object
   */
  public static async delete<T>(
    this: BaseModel<T>,
    filter: PrimaryIdType | Record<string, any>,
  ): Promise<number> {
    const query = this.query();

    if (
      filter instanceof ObjectId ||
      typeof filter === "string" ||
      typeof filter === "number"
    ) {
      const result = await query.deleteOne({
        [this.primaryIdColumn]: filter,
      });

      return result.deletedCount;
    }

    const result = await query.deleteMany(filter);

    return result.deletedCount;
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
