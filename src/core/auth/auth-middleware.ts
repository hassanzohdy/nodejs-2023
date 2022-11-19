import config from "@mongez/config";
import { Request } from "core/http/request";
import { Response } from "core/http/response";
import { setCurrentUser } from "./current-user";
import jwt from "./jwt";

export function authMiddleware(allowedUserType?: string) {
  return async function auth(request: Request, response: Response) {
    try {
      // use our own jwt verify to verify the token
      await jwt.verify();
      // get current user
      const user: any = request.baseRequest.user;

      // now, we need to get an instance of user using its corresponding model
      const userType = user.userType;

      // check if the user type is allowed
      if (allowedUserType && userType !== allowedUserType) {
        return response.unauthorized({
          error: "You are not allowed to access this resource",
        });
      }

      // get user model class
      const UserModel = config.get(`auth.userType.${userType}`);

      // get user model instance
      const currentUser = await UserModel.findBy("_id", user._id);

      // set current user
      setCurrentUser(currentUser);
    } catch (err) {
      // unset current user
      setCurrentUser(undefined);
      return response.unauthorized({
        error: "Unauthorized: Invalid Access Token",
      });
    }
  };
}
