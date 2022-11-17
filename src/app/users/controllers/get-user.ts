import { Request } from "core/http/request";

export default function getUser(request: Request) {
  return {
    id: request.params.id,
  };
}
