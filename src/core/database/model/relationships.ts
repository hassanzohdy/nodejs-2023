import CrudModel from "./crud-model";
import Model from "./model";
import ModelAggregate from "./ModelAggregate";
import ModelSync from "./ModelSync";
import { ChildModel, ModelDocument } from "./types";

export default abstract class RelationshipModel extends CrudModel {
  /**
   * Sync with list
   */
  public syncWith: ModelSync[] = [];

  /**
   * Get new aggregate for current model
   */
  public static aggregate<T>(this: ChildModel<T>) {
    return new ModelAggregate<T>(this);
  }

  /**
   * Sync with the given model
   */
  public static sync(columns: string | string[], embedMethod = "embedData") {
    return new ModelSync(this as typeof Model, columns, embedMethod);
  }

  /**
   * Sync data on saving
   */
  public startSyncing(saveMode: "create" | "update") {
    for (const modelSync of this.syncWith) {
      modelSync.sync(this as any, saveMode);
    }
  }

  /**
   * Sync destruction
   * Called when destroy method is called
   */
  public syncDestruction() {
    for (const modelSync of this.syncWith) {
      modelSync.syncDestruction(this as any);
    }
  }

  /**
   * The syncing model (That calls startSyncing) is being embedded in multiple documents of current model
   * I.e Country.syncMany('cities') while current model is City
   */
  public static syncMany(
    columns: string | string[],
    embedMethod = "embedData",
  ) {
    return new ModelSync(this as typeof Model, columns, embedMethod).syncMany();
  }

  public reassociate(
    this: Model,
    column: string,
    model: Model | ModelDocument,
    embedWith?: string,
  ) {
    const columnValue =
      model instanceof Model
        ? embedWith
          ? (model as any)[embedWith]()
          : model.data
        : model;

    if (columnValue === undefined) return;

    const documentsList = this.get(column, []);

    const index = documentsList.findIndex(
      (doc: any) => doc.id === columnValue.id,
    );

    if (index === -1) {
      documentsList.push(columnValue);
    } else {
      documentsList[index] = columnValue;
    }

    this.set(column, documentsList);

    return this;
  }

  /**
   * Associate a model with the current model
   */
  public associate(
    this: Model,
    column: string,
    model: Model | ModelDocument,
    embedWith?: string,
  ) {
    const columnValue =
      model instanceof Model
        ? embedWith
          ? (model as any)[embedWith]()
          : model.data
        : model;

    if (columnValue === undefined) return this;

    const documentsList = this.get(column, []);

    documentsList.push(columnValue);

    this.set(column, documentsList);

    return this;
  }

  /**
   * Disassociate a model with the current model
   */
  public disassociate(
    this: Model,
    column: string,
    model: Model | ModelDocument,
  ) {
    const columnValue = model instanceof Model ? model.data : model;

    if (columnValue === undefined) return;

    const documentsList = this.get(column, []);

    const index = documentsList.findIndex(
      (doc: any) => doc.id === columnValue.id,
    );

    if (index !== -1) {
      documentsList.splice(index, 1);
    }

    this.set(column, documentsList);

    return this;
  }

  /**
   * 1 to 1 relationship
   * Used with aggregate with `with` method
   */
  public static oneToOne(
    model: typeof Model,
    as: string,
    localField = as + ".id",
    foreignField = "id",
    select?: string[],
  ) {
    return {
      model,
      localField,
      foreignField,
      as,
      single: true,
      select,
    };
  }

  /**
   * 1 to many relationship
   * Used with aggregate with `with` method
   */
  public static oneToMany(
    model: typeof Model,
    as: string,
    localField = as + ".id",
    foreignField = "id",
    select?: string[],
  ) {
    return {
      model,
      localField,
      foreignField,
      as,
      select,
    };
  }
}
