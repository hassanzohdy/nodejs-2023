import router from "core/router";
import createUser from "./controllers/create-user";
import getUser from "./controllers/get-user";
import usersList from "./controllers/users-list";
import User from "./models/user";

router.get("/users", usersList);
router.get("/users/:id", getUser);
router.post("/users", createUser);

setTimeout(async () => {
  const user = await User.create({
    name: "Test",
  });

  console.log(user.data);

  setTimeout(async () => {
    user.set("published", true);

    await user.save();

    console.log(user.data);
  }, 3000);
}, 4000);
