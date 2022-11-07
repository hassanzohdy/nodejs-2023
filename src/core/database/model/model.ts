import {
  areEqual,
  except,
  get,
  merge,
  only,
  set,
} from "@mongez/reinforcements";
import Is from "@mongez/supportive-is";
import queryBuilder from "../query-builder/query-builder";
import CrudModel from "./curd-model";
import { Casts, CastType, Document, ModelDocument } from "./types";

const MISSING_KEY = Symbol("MISSING_KEY");

export default abstract class Model extends CrudModel {
  /**
   * Model Initial Document data
   */
  public initialData: Partial<ModelDocument> = {};

  /**
   * Model Document data
   */
  public data: Partial<ModelDocument> = {};

  /**
   * Define Default value data that will be merged with the models' data
   * on the create process
   */
  public defaultValue: Document = {};

  /**
   * A flag to determine if the model is being restored
   */
  protected isRestored = false;

  /**
   * Model casts types
   */
  protected casts: Casts = {};

  /**
   * Constructor
   */
  public constructor(public originalData: Partial<ModelDocument> = {}) {
    //
    super();
    this.data = { ...this.originalData };

    this.initialData = { ...this.originalData };
  }

  /**
   * Mark the current model as being restored
   */
  public markAsRestored() {
    this.isRestored = true;
  }

  /**
   * Set a column in the model data
   */
  public set(column: string, value: any) {
    this.data = set(this.data, column, value);

    return this;
  }

  /**
   * Get value of the given column
   */
  public get(column: string, defaultValue = null) {
    return get(this.data, column, defaultValue);
  }

  /**
   * Determine whether the given column exists in the document
   */
  public has(column: string) {
    return get(this.data, column, MISSING_KEY) !== MISSING_KEY;
  }

  /**
   * Get all columns except the given ones
   */
  public except(columns: string[]): Document {
    return except(this.data, columns);
  }

  /**
   * Get only the given columns
   */
  public only(columns: string[]): Document {
    return only(this.data, columns);
  }

  /**
   * Unset or remove the given columns from the data
   */
  public unset(...columns: string[]) {
    this.data = except(this.data, columns);

    return this;
  }

  /**
   * Replace the entire document data with the given new data
   */
  public replaceWith(data: Document) {
    if (!data.id && this.data.id) {
      data.id = this.data.id;
    }

    if (!data._id && this.data._id) {
      data._id = this.data._id;
    }

    this.data = data;

    return this;
  }

  /**
   * Merge the given documents to current document
   */
  public merge(data: Document) {
    this.data = merge(this.data, data);

    return this;
  }

  /**
   * Perform saving operation either by updating or creating a new record in database
   */
  public async save(mergedData: Document = {}) {
    this.merge(mergedData);

    // check if the data contains the primary id column
    if (!this.isNewModel()) {
      // perform an update operation
      // check if the data has changed
      // if not changed, then do not do anything
      if (areEqual(this.originalData, this.data)) return;

      this.data.updatedAt = new Date();

      this.castData();

      await queryBuilder.update(
        this.getCollectionName(),
        {
          _id: this.data._id,
        },
        this.data,
      );
    } else {
      // creating a new document in the database
      const generateNextId =
        this.getStaticProperty("generateNextId").bind(Model);

      // check for default values and merge it with the data
      this.checkDefaultValues();

      // if the column does not exist, then create it
      if (!this.data.id) {
        this.data.id = await generateNextId();
      }

      const now = new Date();

      // if the column does not exist, then create it
      if (!this.data.createdAt) {
        this.data.createdAt = now;
      }

      // if the column does not exist, then create it
      if (!this.data.updatedAt) {
        this.data.updatedAt = now;
      }

      this.castData();

      this.data = await queryBuilder.create(
        this.getCollectionName(),
        this.data,
      );
    }

    this.originalData = this.data;
    console.log(this.originalData);
  }

  /**
   * Cast data before saving
   */
  protected castData() {
    for (const column in this.casts) {
      if (!this.isDirty(column)) continue;

      let value = this.get(column);

      if (value === undefined) continue;

      const castType = this.casts[column];

      if (typeof castType === "function") {
        value = castType(column, value, this);
      } else {
        value = this.castValue(value, castType);
      }

      this.set(column, value);
    }
  }

  /**
   * Cast the given value based on the given cast type
   */
  protected castValue(value: any, castType: CastType) {
    switch (castType) {
      case "string":
        return String(value);

      case "number":
        return Number(value);

      case "int":
      case "integer":
        return parseInt(value);

      case "float":
        return parseFloat(value);

      case "bool":
      case "boolean":
        if (value === "true") return true;

        if (value === "false" || value === "0" || value === 0) return false;

        return Boolean(value);

      case "date":
        if (typeof value === "string") {
          return new Date(value);
        }

        // timestamp
        if (typeof value === "number") {
          // timestamp in seconds
          return new Date(value * 1000);
        }

        if (value instanceof Date) {
          return value;
        }

        return new Date();

      case "object":
        if (!value) return {};

        if (typeof value === "string") {
          return JSON.parse(value);
        }

        return value;
      case "array":
        if (!value) return [];

        if (typeof value === "string") {
          return JSON.parse(value);
        }

        return value;
      default:
        return value;
    }
  }

  /**
   * Check for default values
   */
  protected checkDefaultValues() {
    // if default value is empty, then do nothing
    if (Is.empty(this.defaultValue)) return;

    // merge the data with default value
    this.data = merge(this.defaultValue, this.data);
  }

  /**
   * Destroy the model and delete it from database collection
   */
  public async destroy() {
    if (!this.data._id) return;

    this.data.deletedAt = new Date();

    // users -> userTrash
    await queryBuilder.create(this.getCollectionName() + "Trash", {
      document: this.data,
      _id: this.data._id,
      id: this.data.id,
    });

    await queryBuilder.deleteOne(this.getCollectionName(), {
      _id: this.data._id,
    });
  }

  /**
   * Determine if the given column is dirty column
   *
   * Dirty columns are columns that their values have been changed from the original data
   */
  public isDirty(column: string) {
    if (this.isNewModel()) return true;

    const currentValue = get(this.data, column);
    const originalValue = get(this.originalData, column);

    return areEqual(currentValue, originalValue) === false;
  }

  /**
   * Check if current model is a new model
   */
  public isNewModel() {
    return !this.data._id || (this.data._id && this.isRestored);
  }
}
