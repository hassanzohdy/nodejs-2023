import AccessToken from "core/auth/models/access-token/access-token";
import Auth from "core/auth/models/auth";
import castPassword from "core/database/casts/cast-password";
import { Casts, Document } from "core/database/model/types";
import UserResource from "../../resources/user-resource";
import UserGroup from "../usersGroup/userGroup";

export default class User extends Auth {
  /**
   * Collection name
   */
  public static collectionName = "users";

  /**
   * {@inheritdoc}
   */
  public syncWith = [];

  /**
   * Resource
   */
  public static resource = UserResource;

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

  public static withAccessTokens() {
    return this.oneToMany(AccessToken, "tokens");
  }

  public static withGroup() {
    return this.oneToOne(UserGroup, "group");
  }
}
