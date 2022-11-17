import config from "@mongez/config";
import { Request } from "core/http/request";
import { Response } from "core/http/response";
import { setCurrentUser } from "./current-user";
import jwt from "./jwt";

export async function authMiddleware(request: Request, response: Response) {
  try {
    // use our own jwt verify to verify the token
    await jwt.verify();
    // get current user
    const user: any = request.baseRequest.user;

    // now, we need to get an instance of user using its corresponding model
    const userType = user.userType;
    // get user model class
    const UserModel = config.get(`auth.userType.${userType}`);

    // get user model instance
    const currentUser = await UserModel.findBy("_id", user._id);

    // set current user
    setCurrentUser(currentUser);
  } catch (err) {
    // unset current user
    setCurrentUser(undefined);
    return response.badRequest({
      error: "Unauthorized: Invalid Access Token",
    });
  }
}
