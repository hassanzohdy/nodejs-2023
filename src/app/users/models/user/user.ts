import AccessToken from "core/auth/models/access-token/access-token";
import Auth from "core/auth/models/auth";
import castEmail from "core/database/casts/cast-email";
import castPassword from "core/database/casts/cast-password";
import expiresAfter from "core/database/casts/expiresAfter";
import randomInteger from "core/database/casts/randomInteger";
import { Casts, Document } from "core/database/model/types";
import UserResource from "../../resources/user-resource";

export default class User extends Auth {
  /**
   * Collection name
   */
  public static collection = "users";

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
    isActive: false,
  };

  protected casts: Casts = {
    name: "string",
    gender: "string",
    username: "string",
    isActive: "boolean",
    activatedAt: "date",
    email: castEmail,
    password: castPassword,
    activationCode: randomInteger(1000, 9999),
    codeExpiresAt: expiresAfter(15, "minutes"),
  };

  /**
   * Set guarded fields
   */
  protected guarded = ["password"];

  /**
   * {@inheritDoc}
   */
  public static withAccessTokens() {
    return this.oneToMany(AccessToken, "tokens");
  }
}
