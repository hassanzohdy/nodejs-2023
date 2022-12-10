import User from "../models/user/user";

export default async function usersList() {
  const users = await User.list();

  return {
    users,
  };
}
