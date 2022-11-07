import { Model } from "core/database";
import { Document } from "core/database/model/types";

export default class User extends Model {
  /**
   * Collection name
   */
  public static collectionName = "users";

  /**
   * {@inheritDoc}
   */
  public defaultValue: Document = {
    isActive: true,
    isEmailVerified: false,
    isPhoneVerified: false,
  };
}
