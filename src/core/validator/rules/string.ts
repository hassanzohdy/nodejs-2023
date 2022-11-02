import Is from "@mongez/supportive-is";

export default class StringRule {
  /**
   * Rule name
   */
  public static ruleName = "string";

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
    this.isValid = Is.string(this.value) && !Is.numeric(this.value);
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
    return `${this.input} is not a string`;
  }
}
