import { except, get, merge, only, set } from "@mongez/reinforcements";
import CrudModel from "./curd-model";
import { Document, ModelDocument } from "./types";

const MISSING_KEY = Symbol("MISSING_KEY");

export default abstract class Model extends CrudModel {
  /**
   * Model Document data
   */
  public data: Partial<ModelDocument> = {};

  /**
   * Constructor
   */
  public constructor(public originalData: Partial<ModelDocument> = {}) {
    //
    super();
    this.data = { ...this.originalData };
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
  public replace(data: Document) {
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
}
