import router from "core/router";
import activateAccount from "./controllers/auth/activateAccount";
import createAccount from "./controllers/auth/createAccount";
import login from "./controllers/auth/login";
import resendActivationCode from "./controllers/auth/resendActivationCode";
import restfulUser from "./controllers/restful-user";

router.resource("/users", restfulUser);

router.post("/login", login);
router.post("/register", createAccount);
router.post("/resend-activation-code", resendActivationCode);
router.post("/activate-account", activateAccount);
