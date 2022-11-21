import { connection } from "core/database";
import router from "core/router";
import { Middleware } from "core/router/types";
import createUser from "./controllers/create-user";
import getUser from "./controllers/get-user";
import usersList from "./controllers/users-list";

const guarded: Middleware = (request, response) => {
  console.log("Logging From Middleware");
};

const mid2: Middleware = (request, resposne) => {
  console.log("Second Middleware");
};

router.get("/users", usersList, {
  middleware: [guarded, mid2],
});

router.get("/users/:id", getUser);
router.post("/create-account", createUser);

connection.on("connected", async () => {
  // const user = new User({
  //   isActive: "0",
  //   isPhoneVerified: "",
  //   joinDate: "2022-05-04",
  //   password: "1234556",
  // });
  // await user.save();
  // console.log(user.data);
});
