import { Request } from "core/http/request";

export default async function createUser(request: Request) {
  const { name, email } = request.body;

  return {
    name,
  };
}

createUser.validation = {
  rules: {
    name: ["required", "string"],
    email: ["required", "email"],
  },
};
