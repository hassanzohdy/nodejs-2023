import router from "core/router";
import usersList from "./controllers/users-list";

router.get("/users", usersList);
