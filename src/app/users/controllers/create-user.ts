import { Request } from "core/http/request";

export default async function createUser(request: Request) {
  const name = request.input("name");
  const email = request.input("email");

  console.log(request.request.body); // fastify request object
  console.log(request.body);

  return {
    user: {
      name,
      email,
    },
  };
}
