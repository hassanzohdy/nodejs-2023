import { connection } from "core/database";
import router from "core/router";
import login from "./controllers/auth/login";
import restfulUser from "./controllers/restful-user";
import User from "./models/user";

router.resource("/users", restfulUser);

router.post("/login", login);

connection.on("connected", async () => {
  console.log(await User.aggregate().whereNull("email").delete());
});
