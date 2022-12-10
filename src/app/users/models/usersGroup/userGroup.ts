import { Casts, Model } from "core/database";

export default class UserGroup extends Model {
  /**
   * Collection name
   */
  public static collectionName = "usersGroups";

  /**
   * {@inheritDoc}
   */
  protected casts: Casts = {
    name: "string",
    permissions: "array",
  };
}
