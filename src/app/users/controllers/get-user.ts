import { Request } from "core/http";

export default function getUser(request: Request) {
  return {
    id: request.params.id,
  };
}
