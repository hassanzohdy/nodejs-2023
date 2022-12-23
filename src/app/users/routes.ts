import router from "core/router";
import activateAccount from "./controllers/auth/activateAccount";
import createAccount from "./controllers/auth/createAccount";
import login from "./controllers/auth/login";
import resendActivationCode from "./controllers/auth/resendActivationCode";
import restfulUsers from "./controllers/restful-users";
import { adminUser, canNotBeLoggedIn } from "./middleware";

router.restfulResource("/users", restfulUsers, {
  middleware: [adminUser],
});

router.group(
  {
    name: "auth",
    middleware: [canNotBeLoggedIn],
  },
  () => {
    router.post("/login", login);
    router.post("/register", createAccount);
    router.post("/resend-activation-code", resendActivationCode);
    router.post("/activate-account", activateAccount);
  },
);
