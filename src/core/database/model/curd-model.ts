import { ObjectId } from "mongodb";
import BaseModel from "./bae-model";
import { ChildModel, PaginationListing, PrimaryIdType } from "./types";

export default abstract class CrudModel extends BaseModel {
  /**
   * Create a new record in the database for the current model (child class of this one)
   * and return a new instance of it with the created data and the new generated id
   */
  public static async create<T>(
    this: ChildModel<T>,
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
    this: ChildModel<T>,
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
    this: ChildModel<T>,
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
    this: ChildModel<T>,
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
  public static async find<T>(this: ChildModel<T>, id: PrimaryIdType) {
    return this.findBy(this.primaryIdColumn, id);
  }

  /**
   * Find document by the given column and value
   */
  public static async findBy<T>(
    this: ChildModel<T>,
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
    this: ChildModel<T>,
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
    this: ChildModel<T>,
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
    this: ChildModel<T>,
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
}
