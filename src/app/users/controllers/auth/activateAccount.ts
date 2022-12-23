import { User } from "app/users/models/user";
import { getCurrentUser, setCurrentUser } from "core/auth";
import { Request, Response } from "core/http";
import dayjs from "dayjs";

export default async function activateAccount(
  request: Request,
  response: Response,
) {
  const currentUser = getCurrentUser<User>();

  currentUser.unset("codeExpiresAt", "activationCode");

  currentUser.save({
    isActive: true,
    activatedAt: new Date(),
  });

  return response.success();
}

activateAccount.validation = {
  rules: {
    code: ["required"],
    email: ["required", "email"],
  },
  validate: async (request: Request, response: Response) => {
    const user = await User.aggregate()
      .where("email", String(request.input("email")).toLowerCase())
      .where("isActive", false)
      .where("activationCode", Number(request.input("code")))
      .first();

    if (!user) {
      return response.notFound({
        error: "Invalid activation code",
      });
    }

    if (dayjs(user.get("codeExpiresAt")).isBefore(new Date())) {
      return response.badRequest({
        error: "Activation code has expired",
      });
    }

    setCurrentUser(user);
  },
};
