import { User } from "../models/user";

export async function getUserByEmailOrUsername(value: string) {
  return await User.aggregate()
    .orWhere({
      email: value,
      username: value,
    })
    .first();
}
