import { verify } from "@mongez/password";
import { except } from "@mongez/reinforcements";
import { Model } from "core/database";
import { ChildModel } from "core/database/model/types";
import jwt from "../jwt";
import AccessToken from "./access-token/access-token";

export default abstract class Auth extends Model {
  /**
   * Get user type
   */
  public abstract get userType(): string;

  /**
   * Generate jwt token
   */
  public async generateAccessToken(): Promise<string> {
    //
    // store the main data in the data object
    // we need to store the user data in an object
    // that we'll sue to generate the token
    // and also it will be saved in the Access Token model under `user` column
    const data = {
      ...this.only(["id", "_id"]),
      userType: this.userType,
    };

    // use our own jwt generator to generate a token for the guest
    const token = await jwt.generate(data);

    // store token and the auth model data in the access token model
    // note that we didn't make it sync because we don't want to wait for the token to be stored in the database
    // as nothing depends on it
    AccessToken.create({
      token,
      user: data,
    });

    return token;
  }

  /**
   * Attempt to login the user
   */
  public static async attempt<T>(
    this: ChildModel<T>,
    data: any,
  ): Promise<T | null> {
    // find first user with the given data, but exclude from it the password
    const user = await this.first(except(data, ["password"]));

    if (!user) {
      return null;
    }

    // now verify the password

    if (!verify((user as any).get("password"), data.password)) {
      return null;
    }

    return user;
  }
}
