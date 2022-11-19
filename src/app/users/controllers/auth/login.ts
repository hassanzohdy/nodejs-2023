import User from "app/users/models/user";
import jwt from "core/auth/jwt";
import { Request } from "core/http/request";
import { Response } from "core/http/response";

export default async function login(request: Request, response: Response) {
  // get the email and password from the request body
  const { email, password } = request.only(["email", "password"]);

  const user = await User.attempt({ email, password });

  if (!user) {
    return response.badRequest({
      error: "Invalid credentials",
    });
  }

  // generate access token
  const token = await jwt.generate({
    ...user.only(["id", "_id"]),
    userType: "user",
  });

  return response.success({
    user: user.data,
    // send the access token to the client
    accessToken: token,
    // send the user type to the client
    userType: "user",
  });
}
