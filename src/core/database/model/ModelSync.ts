import Model from "./model";

type OnDelete = "unset" | "remove";

export default class ModelSync {
  /**
   * What do do when model is deleted
   */
  protected whenDelete: OnDelete = "unset";

  /**
   * Embed on create
   */
  protected embedOnCreate = "";

  /**
   * Sync mode
   */
  protected syncMode: "single" | "many" = "single";

  /**
   * Constructor
   */
  public constructor(
    protected model: typeof Model,
    protected columns: string | string[],
    protected embedMethod = "embedData",
  ) {
    //
  }

  /**
   * Unset on delete
   */
  public unsetOnDelete() {
    this.whenDelete = "unset";

    return this;
  }

  /**
   * Remove on delete
   */
  public removeOnDelete() {
    this.whenDelete = "remove";

    return this;
  }

  /**
   * Embed on create to injected model one the original model is created
   */
  public embedOnCreateFrom(column: string) {
    this.embedOnCreate = column;

    return this;
  }

  /**
   * Mark as many sync
   */
  public syncMany() {
    this.syncMode = "many";

    return this;
  }

  public async sync(model: Model, saveMode: "create" | "update") {
    if (saveMode === "update") {
      return this.syncUpdate(model);
    }

    if (!this.embedOnCreate) return;

    const columns = Array.isArray(this.columns) ? this.columns : [this.columns];

    const parentModel: Model = await (this.model as any).first({
      id: model.get(this.embedOnCreate + ".id"),
    });

    if (!parentModel) return;

    const modelData =
      typeof (model as any)[this.embedMethod] !== "undefined"
        ? (model as any)[this.embedMethod]()
        : model.data;

    for (const column of columns) {
      if (this.syncMode === "single") {
        parentModel.set(column, modelData);
      } else {
        parentModel.associate(column, modelData);
      }
    }

    await parentModel.save();
  }

  /**
   * Sync update
   */
  public async syncUpdate(model: Model) {
    const columns = Array.isArray(this.columns) ? this.columns : [this.columns];

    const query: any = {};

    for (const column of columns) {
      query[column + ".id"] = model.get("id");
    }

    const models: Model[] = await (this.model as any)
      .aggregate()
      .orWhere(query)
      .get();

    const modelData =
      typeof (model as any)[this.embedMethod] !== "undefined"
        ? (model as any)[this.embedMethod]()
        : model.data;

    for (const currentModel of models) {
      for (const column of columns) {
        if (this.syncMode === "single") {
          currentModel.set(column, modelData);
        } else {
          currentModel.reassociate(column, modelData);
        }
      }

      await currentModel.save();
    }
  }

  /**
   * Sync model destruction
   */
  public async syncDestruction(model: Model) {
    const columns = Array.isArray(this.columns) ? this.columns : [this.columns];

    const query: any = {};

    for (const column of columns) {
      query[column + ".id"] = model.get("id");
    }

    const models: Model[] = await (this.model as any)
      .aggregate()
      .orWhere(query)
      .get();

    for (const currentModel of models) {
      if (this.whenDelete === "unset") {
        for (const column of columns) {
          if (this.syncMode === "single") {
            currentModel.unset(column);
          } else {
            currentModel.disassociate(column, model);
          }
        }

        await currentModel.save();
      } else {
        await currentModel.destroy();
      }
    }
  }
}
