import router from "core/router";
import login from "./controllers/auth/login";
import createUser from "./controllers/create-user";
import getUser from "./controllers/get-user";
import usersList from "./controllers/users-list";

router.get("/users", usersList, {
  // add the route name
  name: "users.list",
});

router.get("/users/:id", getUser);
router.post("/users", createUser);
router.post("/login", login);
