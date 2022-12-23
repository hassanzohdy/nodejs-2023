import { User } from "app/users/models/user";
import { getCurrentUser, setCurrentUser } from "core/auth";
import { Request, response, Response } from "core/http";

export default async function login() {
  const user = getCurrentUser<User>();

  const auth = await user.generateAccessToken();

  return response.success({
    user: {
      ...user.toJSON(),
      ...auth,
    },
  });
}

login.validation = {
  validate: async (request: Request, response: Response) => {
    const user = await User.attempt(request.only(["email", "password"]));

    if (!user) {
      return response.badRequest({
        error: "Invalid credentials",
      });
    }

    setCurrentUser(user);
  },
};
