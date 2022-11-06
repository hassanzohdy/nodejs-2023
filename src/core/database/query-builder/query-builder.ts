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
}

const queryBuilder = new QueryBuilder();

export default queryBuilder;
