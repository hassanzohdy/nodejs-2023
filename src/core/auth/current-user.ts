import Auth from "./models/auth";

let currentUser: Auth | undefined;

/**
 * Set current user
 */
export function setCurrentUser(model: Auth | undefined) {
  currentUser = model;
}

/**
 * Get current user model
 */
export function user() {
  return currentUser;
}

export function getCurrentUser<T = Auth | null>(): T {
  return currentUser as T;
}
