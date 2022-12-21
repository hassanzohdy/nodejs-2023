import confirmRegistrationMail from "app/users/mail/confirmRegistrationMail";
import User from "app/users/models/user/user";
import { usernamePattern } from "app/users/utils/flags";
import { Request, Response } from "core/http";
import PatternRule from "core/validator/rules/pattern";
import UniqueRule from "core/validator/rules/unique";

export default async function createAccount(
  request: Request,
  response: Response,
) {
  const data = request.only(["name", "username", "email", "password"]);
  User.create(data).then(confirmRegistrationMail);

  return response.success();
}

createAccount.validation = {
  rules: {
    name: ["required"],
    password: ["required", "minLength:8", "confirmed"],
    gender: ["in:male,female"],
    username: [
      "required",
      new PatternRule(usernamePattern),
      new UniqueRule(User.collection).insensitive(),
    ],
    email: ["required", "email", new UniqueRule(User.collection).insensitive()],
  },
};
