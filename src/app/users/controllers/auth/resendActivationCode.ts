import confirmRegistrationMail from "app/users/mail/confirmRegistrationMail";
import { User } from "app/users/models/user";
import { Request, Response } from "core/http";
import { ExistsRule } from "core/validator";

export default async function resendActivationCode(
  request: Request,
  response: Response,
) {
  //
  const user = await User.first({
    email: request.input("email"),
  });

  if (!user) {
    return response.badRequest({
      error: "User not found",
    });
  }

  if (user.get("isActive")) {
    return response.badRequest({
      error: "User already activated",
    });
  }

  user
    .save({
      activationCode: true,
      codeExpiresAt: true,
    })
    .then(confirmRegistrationMail);

  return response.success({
    message: "Activation code sent",
  });
}

resendActivationCode.validation = {
  rules: {
    email: ["required", "email", new ExistsRule(User.collection).insensitive()],
  },
};
