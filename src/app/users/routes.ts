import { connection } from "core/database";
import router from "core/router";
import createUser from "./controllers/create-user";
import getUser from "./controllers/get-user";
import usersList from "./controllers/users-list";
import User from "./models/user";

router.get("/users", usersList);
router.get("/users/:id", getUser);
router.post("/users", createUser);

connection.on("error", (error: any) => {
  console.log("Database Error:");
  console.log(error);
});

connection.on("connected", async () => {
  const user = new User({
    isActive: "0",
    isPhoneVerified: "",
    joinDate: "2022-05-04",
    password: "1234556",
  });

  await user.save();

  console.log(user.data);
});
