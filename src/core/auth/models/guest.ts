import Auth from "./auth";

export default class Guest extends Auth {
  /**
   * {@inheritDoc}
   */
  public static collectionName = "guests";

  /**
   * Get user type
   */
  public get userType(): string {
    return "guest";
  }
}
