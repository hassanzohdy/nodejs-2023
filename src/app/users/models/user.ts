import { Model } from "core/database";
import castPassword from "core/database/casts/cast-password";
import { Casts, Document } from "core/database/model/types";

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

  protected casts: Casts = {
    isActive: "boolean",
    isPhoneVerified: "boolean",
    joinDate: "date",
    password: castPassword,
  };
}
