import { verify } from "@mongez/password";
import { except } from "@mongez/reinforcements";
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

  /**
   * Attempt to login the user
   */
  public static async attempt(data: any) {
    // find first user with the given data, but exclude from it the password
    const user = await this.first(except(data, ["password"]));

    if (!user) {
      return null;
    }

    // now verify the password

    if (!verify(user.get("password"), data.password)) {
      return null;
    }

    return user;
  }
}
