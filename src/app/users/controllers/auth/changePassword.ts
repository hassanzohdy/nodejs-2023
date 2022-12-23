import User from "app/users/models/user/user";
import { getCurrentUser } from "core/auth";
import { Request, Response } from "core/http";

export default async function changePassword(
  request: Request,
  response: Response,
) {
  const user = getCurrentUser<User>();

  user.save({
    password: request.input("password"),
  });

  return response.success();
}

changePassword.validation = {
  rules: {
    currentPassword: ["required"],
    password: ["required", "minLength:8", "confirmed"],
  },
  validate: (request: Request, response: Response) => {
    const user = getCurrentUser<User>();

    if (!user.confirmPassword(request.input("currentPassword"))) {
      return response.badRequest({
        error: "Invalid current password",
      });
    }
  },
};
