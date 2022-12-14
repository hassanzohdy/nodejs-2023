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
   * Input name
   */
  protected input = "";

  /**
   * Input value
   */
  protected value = "";

  /**
   * Validate the rule
   */
  public async validate() {
    //
  }

  /**
   * Set input name
   */
  public setInput(input: string) {
    this.input = input;

    return this;
  }

  /**
   * Set input value
   */
  public setValue(value: any) {
    this.value = value;

    return this;
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

  public error() {
    return `${this.input} is not valid`;
  }
}
