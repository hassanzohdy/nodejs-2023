import { Model } from "core/database";
import RepositoryListManager from "./repository-list-manager";

export default abstract class RepositoryDestroyManager<
  T extends Model,
  M extends typeof Model = typeof Model,
> extends RepositoryListManager<T, M> {
  /**
   * Delete Record
   */
  public async delete(id: number | string | T) {
    const model = await this.find(id);

    if (!model) return;

    this.onDeleting(model);

    this.trigger("deleting", model);

    await model.destroy();

    this.onDelete(model);

    this.trigger("delete", model);

    return model;
  }

  /**
   * On deleting
   */
  // eslint-disable-next-line unused-imports/no-unused-vars
  protected onDeleting(model: T) {
    //
  }

  /**
   * On delete
   */
  // eslint-disable-next-line unused-imports/no-unused-vars
  protected onDelete(model: T) {
    //
  }
}