import queryBuilder from "core/database/query-builder/query-builder";
import router from "core/router";
import createUser from "./controllers/create-user";
import getUser from "./controllers/get-user";
import usersList from "./controllers/users-list";
import User from "./models/user";

router.get("/users", usersList);
router.get("/users/:id", getUser);
router.post("/users", createUser);

setTimeout(async () => {
  const totalUsers = await queryBuilder.count("users");

  const totalUsers2 = await User.count();

  console.log(totalUsers, totalUsers2);
}, 4000);
