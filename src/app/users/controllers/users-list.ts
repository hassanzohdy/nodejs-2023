import database from "core/database";
import { Request } from "core/http/request";

export default async function usersList(request: Request) {
  const usersCollection = database.collection("users");

  const users = await usersCollection.find({}).toArray();

  return {
    users,
  };
}
