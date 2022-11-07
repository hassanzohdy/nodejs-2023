import router from "core/router";
import createUser from "./controllers/create-user";
import getUser from "./controllers/get-user";
import usersList from "./controllers/users-list";
import User from "./models/user";

router.get("/users", usersList);
router.get("/users/:id", getUser);
router.post("/users", createUser);

setTimeout(async () => {
  const user = new User({
    name: "Hasan",
  });

  await user.destroy();
}, 4000);
