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
    name: "hasan",
    email: "hassanzohdy@gmail.com",
  });

  const id = user.data._id;

  const updatedUser = await User.upsert(
    {
      id: "my-id",
      job: "Developer",
    },
    {
      name: "HasanZ",
      age: 33,
    },
  );

  console.log(user.data);

  console.log(updatedUser.data);
}, 4000);
