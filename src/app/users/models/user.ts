import Auth from "core/auth/models/auth";
import castPassword from "core/database/casts/cast-password";
import { Casts, Document } from "core/database/model/types";

export default class User extends Auth {
  /**
   * Collection name
   */
  public static collectionName = "users";

  /**
   * Get user type
   */
  public get userType(): string {
    return "user";
  }

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
