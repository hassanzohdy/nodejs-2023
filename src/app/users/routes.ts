import router from "core/router";
import getUser from "./controllers/get-user";
import usersList from "./controllers/users-list";

router.get("/users", usersList);

router.get("/users/:id", getUser);
