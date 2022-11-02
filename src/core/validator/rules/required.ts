export default class RequiredRule {
  /**
   * Error message
   */
  protected error = "";

  /**
   * Rule name
   */
  public static ruleName = "required";

  /**
   * Constructor
   */
  public constructor(
    protected readonly input: string,
    protected readonly value: any,
  ) {
    //
  }
}
