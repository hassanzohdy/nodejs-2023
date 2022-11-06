import router from "core/router";
import createUser from "./controllers/create-user";
import getUser from "./controllers/get-user";
import usersList from "./controllers/users-list";
import User from "./models/user";

router.get("/users", usersList);
router.get("/users/:id", getUser);
router.post("/users", createUser);

setTimeout(async () => {
  const user = await User.find(5);

  if (!user) return;

  await user.save();

  console.log(user.data);

  await user.save({
    published: true,
  });

  await user.save();
  await user.save();
  await user.save();
  await user.save();
  await user.save();
  await user.save();

  console.log(user.data);
}, 4000);
