import { ObjectId } from "mongodb";
import queryBuilder from "../query-builder/query-builder";
import BaseModel from "./base-model";
import {
  ChildModel,
  Document,
  Filter,
  ModelDocument,
  PaginationListing,
  PrimaryIdType,
} from "./types";

export default abstract class CrudModel extends BaseModel {
  /**
   * Create a new record in the database for the current model (child class of this one)
   * and return a new instance of it with the created data and the new generated id
   */
  public static async create<T>(
    this: ChildModel<T>,
    data: Document,
  ): Promise<T> {
    const model = this.self(data); // get new instance of model

    // save the model, and generate the proper columns needed
    await model.save();

    return model;
  }

  /**
   * Update model by the given id
   */
  public static async update<T>(
    this: ChildModel<T>,
    id: PrimaryIdType,
    data: Document,
  ): Promise<T | null> {
    const model = (await this.find(id)) as any;
    // execute the update operation

    if (!model) return null;

    await model.save(data);

    return model;
  }

  /**
   * Replace the entire document for the given document id with the given new data
   */
  public static async replace<T>(
    this: ChildModel<T>,
    id: PrimaryIdType,
    data: Document,
  ): Promise<T | null> {
    const model = (await this.find(id)) as any;

    if (!model) return null;

    model.replaceWith(data);

    await model.save();

    return model;
  }

  /**
   * Restore the document from trash
   */
  public static async restore<T>(
    this: ChildModel<T>,
    id: PrimaryIdType,
  ): Promise<T | null> {
    // retrieve the document from trash collection
    const result = await queryBuilder.first(this.collectionName + "Trash", {
      [this.primaryIdColumn]: id,
    });

    if (!result) return null;

    const document = result.document;

    // otherwise, create a new model with it
    document.restoredAt = new Date();

    const model = this.self(document);

    model.markAsRestored();

    await model.save(); // save again in the same collection

    return model;
  }

  /**
   * Find and update the document for the given filter with the given data or create a new document/record
   * if filter has no matching
   */
  public static async upsert<T>(
    this: ChildModel<T>,
    filter: ModelDocument,
    data: Document,
  ): Promise<T> {
    let model = (await this.first(filter)) as any;

    if (!model) {
      model = this.self({ ...data, ...filter });
    } else {
      model.merge(data);
    }

    await model.save();

    return model;
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

    return result ? this.self(result as ModelDocument) : null;
  }

  /**
   * List multiple documents based on the given filter
   */
  public static async list<T>(
    this: ChildModel<T>,
    filter: Filter = {},
  ): Promise<T[]> {
    const documents = await queryBuilder.list(this.collectionName, filter);

    return documents.map(document => this.self(document));
  }

  /**
   * Paginate records based on the given filter
   */
  public static async paginate<T>(
    this: ChildModel<T>,
    filter: Filter,
    page: number,
    limit: number,
  ): Promise<PaginationListing<T>> {
    const documents = await queryBuilder.list(
      this.collectionName,
      filter,
      query => {
        query.skip((page - 1) * limit).limit(limit);
      },
    );

    const totalDocumentsOfFilter = await queryBuilder.count(
      this.collectionName,
      filter,
    );

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
   * Count total documents based on the given filter
   */
  public static async count(filter: Filter = {}) {
    return await queryBuilder.count(this.collectionName, filter);
  }

  /**
   * Get first model for the given filter
   */
  public static async first<T>(
    this: ChildModel<T>,
    filter: Filter = {},
  ): Promise<T | null> {
    const result = await queryBuilder.first(this.collectionName, filter);

    return result ? this.self(result) : null;
  }

  /**
   * Get last model for the given filter
   */
  public static async last<T>(
    this: ChildModel<T>,
    filter: Filter = {},
  ): Promise<T | null> {
    const result = await queryBuilder.last(this.collectionName, filter);

    return result ? this.self(result) : null;
  }

  /**
   * Get latest documents
   */
  public static async latest<T>(
    this: ChildModel<T>,
    filter: Filter = {},
  ): Promise<T[]> {
    const documents = await queryBuilder.latest(this.collectionName, filter);

    return documents.map(document => this.self(document));
  }

  /**
   * Delete single document if the given filter is an ObjectId of mongodb
   * Otherwise, delete multiple documents based on the given filter object
   */
  public static async delete<T>(
    this: ChildModel<T>,
    filter: PrimaryIdType | Filter,
  ): Promise<number> {
    if (
      filter instanceof ObjectId ||
      typeof filter === "string" ||
      typeof filter === "number"
    ) {
      return (await queryBuilder.deleteOne(this.collectionName, {
        [this.primaryIdColumn]: filter,
      }))
        ? 1
        : 0;
    }

    return await queryBuilder.delete(this.collectionName, filter);
  }
}
