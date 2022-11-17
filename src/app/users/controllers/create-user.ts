import { Request } from "core/http/request";

export default async function createUser(request: Request) {
  const { name, email } = request.body;

  return {
    name,
    email,
  };
}

createUser.validation = {
  rules: {
    name: ["required", "string"],
    email: ["required", "string"],
  },
  validate: async () => {
    //
  },
};
