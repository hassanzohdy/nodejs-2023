import database from "core/database";

export default async function createUser(request: any) {
  const name = request.body.name.value;
  const email = request.body.email.value;

  const usersCollection = database.collection("users");

  const result = await usersCollection.insertOne({
    name,
    email,
    published: true,
  });

  return {
    user: {
      id: result.insertedId,
      name,
      email,
    },
  };
}
