import UserResource from "../resources/user-resource";

export default function getUser() {
  return {
    user: new UserResource({
      id: 12,
      name: "Hasan",
      email: "hassanzohdy@gmail.com",
      age: 33,
    }),
  };
}
