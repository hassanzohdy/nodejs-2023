import User from "app/users/models/user/user";
import { Request, Response } from "core/http";

export default async function login(request: Request, response: Response) {
  const user = await User.attempt(request.only(["email", "password"]));

  if (!user) {
    return response.badRequest({
      error: "Invalid credentials",
    });
  }

  const token = await user.generateAccessToken();

  return response.success({
    user: user,
    // send the access token to the client
    accessToken: token,
    // send the user type to the client
    userType: user.userType,
  });
}
