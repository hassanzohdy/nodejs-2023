import { FindCursor, FindOptions } from "mongodb";
import connection, { Connection } from "../connection";
import { Document, Filter, ModelDocument } from "../model/types";

export class QueryBuilder {
  /**
   * Connection instance
   */
  protected connection: Connection = connection;

  /**
   * Get collection query for the given collection name
   */
  public query(collectionName: string) {
    return this.connection.database.collection(collectionName);
  }

  /**
   * Create a new document in the given collection
   */
  public async create(collectionName: string, data: Document) {
    const query = this.query(collectionName);

    const result = await query.insertOne(data);

    return {
      ...data,
      _id: result.insertedId,
    };
  }

  /**
   * Update model by the given id
   */
  public async update(
    collectionName: string,
    filter: Filter,
    data: Document,
  ): Promise<Partial<ModelDocument> | null> {
    // get the query of the current collection
    const query = this.query(collectionName);

    const result = await query.findOneAndUpdate(
      filter,
      {
        $set: data,
      },
      {
        returnDocument: "after",
      },
    );

    return result.ok ? result.value : null;
  }

  /**
   * Replace the entire document for the given document id with the given new data
   */
  public async replace(
    collectionName: string,
    filter: Filter,
    data: Document,
  ): Promise<Partial<ModelDocument> | null> {
    const query = this.query(collectionName);

    const result = await query.findOneAndReplace(filter, data, {
      returnDocument: "after",
    });

    return result.ok ? result.value : null;
  }

  /**
   * Find and update the document for the given filter with the given data or create a new document/record
   * if filter has no matching
   */
  public async upsert(
    collectionName: string,
    filter: Filter,
    data: Document,
  ): Promise<Partial<ModelDocument> | null> {
    // get the query of the current collection
    const query = this.query(collectionName);

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

    return result.ok ? result.value : null;
  }

  /**
   * Perform a single delete operation for the given collection
   */
  public async deleteOne(
    collectionName: string,
    filter: Filter,
  ): Promise<boolean> {
    const query = this.query(collectionName);

    const result = await query.deleteOne(filter);

    return result.deletedCount > 0;
  }

  /**
   * Delete multiple documents from the given collection
   */
  public async delete(
    collectionName: string,
    filter: Filter = {},
  ): Promise<number> {
    const query = this.query(collectionName);

    const result = await query.deleteMany(filter);

    return result.deletedCount;
  }

  /**
   * Find a single document for the given collection with the given filter
   */
  public async first(
    collectionName: string,
    filter: Filter = {},
    findOptions?: FindOptions,
  ) {
    const query = this.query(collectionName);

    return await query.findOne(filter, findOptions);
  }

  /**
   * Find last document for the given collection with the given filter
   */
  public async last(collectionName: string, filter: Filter = {}) {
    const query = this.query(collectionName);

    const results = await query
      .find(filter)
      .sort({
        _id: "desc",
      })
      .limit(1)
      .toArray();

    return results.length > 0 ? results[0] : null;
  }

  /**
   * Find multiple document for the given collection with the given filter
   */
  public async list(
    collectionName: string,
    filter: Filter,
    queryHandler?: (query: FindCursor) => void,
    findOptions?: FindOptions,
  ) {
    const query = this.query(collectionName);

    const findOperation = query.find(filter, findOptions);

    if (queryHandler) {
      queryHandler(findOperation);
    }

    return await findOperation.toArray();
  }

  /**
   * Find latest documents for the given collection with the given filter
   */
  public async latest(collectionName: string, filter: Filter = {}) {
    const query = this.query(collectionName);

    return await query
      .find(filter)
      .sort({
        _id: "desc",
      })
      .toArray();
  }

  /**
   * Count documents for the given collection with the given filter
   */
  public async count(collectionName: string, filter: Filter = {}) {
    return await this.query(collectionName).countDocuments(filter);
  }
}

const queryBuilder = new QueryBuilder();

export default queryBuilder;
