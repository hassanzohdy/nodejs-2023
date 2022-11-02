import Rule from "./rule";

export default class RequiredRule extends Rule {
  /**
   * Rule name
   */
  public static ruleName = "required";

  /**
   * Validate the rule
   */
  public async validate() {
    this.isValid = Boolean(this.value) && this.value.length > 0;
  }

  /**
   * Get error message
   */
  public error() {
    return `${this.input} is required`;
  }
}
