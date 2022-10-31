import database from "core/database";

export default async function usersList(request: any) {
  const usersCollection = database.collection("users");

  const users = await usersCollection.find({}).toArray();

  return {
    users,
  };
}
