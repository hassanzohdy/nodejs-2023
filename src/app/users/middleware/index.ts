import { getCurrentUser } from "core/auth";
import { response } from "core/http";
import { User } from "../models/user";

export const canNotBeLoggedIn = async () => {
  //
  const user = getCurrentUser();

  if (!user || user.userType === "guest") return;

  return response.unauthorized({
    error: "You are not authorized to perform this action",
  });
};

export async function adminUser() {
  const user = getCurrentUser<User>();

  if (!user || !user.get("isAdmin")) {
    return response.unauthorized({
      error: "You are not authorized to perform this action",
    });
  }
}
