import { Model } from "core/database";

let currentUser: Model | undefined;

/**
 * Set current user
 */
export function setCurrentUser(model: Model | undefined) {
  currentUser = model;
}

/**
 * Get current user model
 */
export function user() {
  return currentUser;
}
