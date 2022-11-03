import { Model } from "core/database";

export default class User extends Model {
  /**
   * Collection name
   */
  public static collectionName = "users";

  public getName() {
    return this.data.name;
  }
}
