import { GenericObject } from "@mongez/reinforcements/cjs/types";
import { CreateIndexesOptions, ObjectId } from "mongodb";
import database from "./database";
import { Model } from "./model";

export default class BluePrint {
  public static model: typeof Model;

  /**
   * Create index
   */
  public static async index(
    columns: string | string[],
    options: CreateIndexesOptions = {},
  ) {
    if (!Array.isArray(columns)) {
      columns = [columns];
    }

    if (!options.name) {
      options.name = this.getIndexName(columns);
    }

    const columnsList = columns.reduce(
      (list: GenericObject, column: string) => {
        list[column] = 1;
        return list;
      },
      {},
    );

    return await this.collection().createIndex(columnsList, options);
  }

  /**
   * Create unique index
   */
  public static async unique(
    column: string | string[],
    options: CreateIndexesOptions = {},
  ) {
    options.unique = true;
    if (!Array.isArray(column)) {
      column = [column];
    }

    if (!options.name) {
      options.name = this.getIndexName(column, "unique");
    }

    return this.index(column, options);
  }

  /**
   * Create text index
   */
  public static async textIndex(
    column: string | string[],
    options: CreateIndexesOptions = {},
  ) {
    options.unique = true;

    if (!Array.isArray(column)) {
      column = [column];
    }

    if (!options.name) {
      options.name = this.getIndexName(column, "text");
    }

    const columnsList = column.reduce((list: GenericObject, column: string) => {
      list[column] = "text";
      return list;
    }, {});

    return await this.collection().createIndex(columnsList, options);
  }

  /**
   * Create geo index
   */
  public static async geoIndex(
    column: string | string[],
    options: CreateIndexesOptions = {},
  ) {
    options.unique = true;

    if (!Array.isArray(column)) {
      column = [column];
    }

    if (!options.name) {
      options.name = this.getIndexName(column, "geo");
    }

    const columnsList = column.reduce((list: GenericObject, column: string) => {
      list[column] = "2dsphere";
      return list;
    }, {});

    return await this.collection().createIndex(columnsList, options);
  }

  /**
   * List indexes
   */
  public static async listIndexes() {
    return await this.collection().listIndexes().toArray();
  }

  /**
   * Drop index
   */
  public static async dropIndex(...columns: string[]) {
    const name = this.getIndexName(columns);
    return await this.collection().dropIndex(name);
  }

  /**
   * Drop unique index
   */
  public static async dropUniqueIndex(...columns: string[]) {
    const name = this.getIndexName(columns, "unique");
    return await this.collection().dropIndex(name);
  }

  /**
   * Drop text index
   */
  public static async dropTextIndex(...columns: string[]) {
    const name = this.getIndexName(columns, "text");
    return await this.collection().dropIndex(name);
  }

  /**
   * Drop geo index
   */
  public static async dropGeoIndex(...columns: string[]) {
    const name = this.getIndexName(columns, "geo");
    return await this.collection().dropIndex(name);
  }

  /**
   * Drop all indexes
   */
  public static async dropAllIndexes() {
    return await this.collection().dropIndexes();
  }

  /**
   * Check if index exists
   */
  public static async indexExists(name: string) {
    return await this.collection().indexExists(name);
  }

  /**
   * Get index name
   */
  public static getIndexName(columns: string[], type = "index") {
    return `${this.model.collection}_${columns.join("_")}_${type}`;
  }

  /**
   * Get index info
   */
  public static async indexInformation() {
    return await this.collection().indexInformation();
  }

  /**
   * Get collection stats
   */
  public static async stats() {
    return await this.collection().stats();
  }

  /**
   * Get collection instance
   */
  public static collection() {
    return database.collection(this.model.collection);
  }

  /**
   * Get base schema
   */
  public static get baseSchema() {
    return {
      _id: ObjectId,
      id: "int",
      createdAt: Date,
      updatedAt: Date,
    };
  }

  /**
   * Get default schema
   */
  public static baseSchemaWith(schema: GenericObject) {
    return {
      ...this.baseSchema,
      ...schema,
    };
  }
}
