import { rootPath } from "@mongez/node";
import { Request } from "core/http/request";

export default async function createUser(request: Request) {
  const image = request.file("image");

  let name = "";

  if (image) {
    name = await image.save(rootPath("storage/images"));
  }

  return {
    image: {
      name,
      size: await image?.size(),
    },
  };
}
