import User from "app/users/models/user";
import { Request, Response } from "core/http";

export default async function login(request: Request, response: Response) {
  // get the email and password from the request body
  const { email, password } = request.only(["email", "password"]);

  const user = await User.attempt({ email, password });

  if (!user) {
    return response.badRequest({
      error: "Invalid credentials",
    });
  }

  const token = await user.generateAccessToken();

  return response.success({
    user: user.data,
    // send the access token to the client
    accessToken: token,
    // send the user type to the client
    userType: user.userType,
  });
}
