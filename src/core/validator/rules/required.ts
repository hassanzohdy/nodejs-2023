export default class RequiredRule {
  /**
   * Rule name
   */
  public static ruleName = "required";

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
    this.isValid = Boolean(this.value) && this.value.length > 0;
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

  /**
   * Get error message
   */
  public error() {
    return `${this.input} is required`;
  }
}
