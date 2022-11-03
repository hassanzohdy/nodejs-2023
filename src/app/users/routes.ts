import router from "core/router";
import createUser from "./controllers/create-user";
import getUser from "./controllers/get-user";
import usersList from "./controllers/users-list";
import User from "./models/user";

router.get("/users", usersList);
router.get("/users/:id", getUser);
router.post("/users", createUser);

setTimeout(async () => {
  const allUsers = await User.paginate({}, 20, 5);

  console.log(allUsers.documents.map(user => user.data));
  console.log(allUsers.paginationInfo);
}, 4000);
