import { Response } from "core/http/response";
import router from "core/router";
import jwt from "./jwt";
import AccessToken from "./models/access-token";
import Guest from "./models/guest";

export default function registerAuthRoutes() {
  // now let's add a guests route in our routes to generate a guest token to our guests.
  router.post("/guests", async (_request, response: Response) => {
    // generate a new guest first
    const guest = await Guest.create({
      userType: "guest",
    });

    // use our own jwt generator to generate a token for the guest
    const token = await jwt.generate(guest.data);

    AccessToken.create({
      token,
      // get the guest user type, id and _id
      ...guest.only(["id", "userType", "_id"]),
    });

    return response.send({
      accessToken: token,
      // return the user type
      userType: guest.get("userType"),
    });
  });
}
