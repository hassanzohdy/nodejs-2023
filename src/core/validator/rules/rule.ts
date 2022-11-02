export default abstract class Rule {
  /**
   * Rule name
   */
  public static ruleName = "";

  /**
   * Determine if rule is valid
   */
  protected isValid = true;

  /**
   * Constructor
   */
  public constructor(
    protected readonly input: string,
    protected readonly value: any,
  ) {
    //
  }

  /**
   * Validate the rule
   */
  public async validate() {
    //
  }

  /**
   * Determine if rule validation passes
   */
  public passes() {
    return this.isValid === true;
  }

  /**
   * Determine if rule validation fails
   */
  public fails() {
    return this.isValid === false;
  }
}
