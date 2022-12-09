import router from "core/router";
import login from "./controllers/auth/login";
import restfulUser from "./controllers/restful-user";

router.resource("/users", restfulUser);

router.post("/login", login);
