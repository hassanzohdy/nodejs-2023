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
    isActive: "0",
    isPhoneVerified: "",
    joinDate: "2022-05-04",
    password: "1234556",
  });

  await user.save();

  user.set("name", "hasan");

  await user.save();

  console.log(user.data);
  console.log(user.initialData);
}, 4000);
