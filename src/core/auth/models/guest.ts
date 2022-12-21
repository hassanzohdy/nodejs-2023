import Auth from "./auth";

export default class Guest extends Auth {
  /**
   * {@inheritDoc}
   */
  public static collection = "guests";

  /**
   * Get user type
   */
  public get userType(): string {
    return "guest";
  }
}
