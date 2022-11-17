import User from "app/users/models/user";
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

  console.log("Logged in successfully");

  // generate access token

  return response.success({
    user: user.data,
  });
}
