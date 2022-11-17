import { user } from "core/auth/current-user";
import database from "core/database";
import { Request } from "core/http/request";

export default async function usersList(request: Request) {
  const usersCollection = database.collection("users");

  // log the current user
  console.log(user());

  const users = await usersCollection.find({}).toArray();

  return {
    users,
  };
}
