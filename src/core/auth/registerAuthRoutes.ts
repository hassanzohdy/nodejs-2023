import { Response } from "core/http/response";
import router from "core/router";
import Guest from "./models/guest";

export default function registerAuthRoutes() {
  // now let's add a guests route in our routes to generate a guest token to our guests.
  router.post("/guests", async (_request, response: Response) => {
    // generate a new guest first
    const guest = await Guest.create({
      userType: "guest",
    });

    // use our own jwt generator to generate a token for the guest
    const token = await guest.generateAccessToken();

    return response.send({
      accessToken: token,
      // return the user type
      userType: guest.userType,
    });
  });
}
