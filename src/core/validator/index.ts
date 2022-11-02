import { Request } from "core/http/request";
import RulesList from "./rules-list";

export default class Validator {
  /**
   * Errors list
   */
  protected errorsList: any[] = [];

  /**
   * Constructor
   */
  public constructor(
    protected readonly request: Request,
    protected readonly rules: any,
  ) {
    //
  }

  /**
   * Scan the validation rules
   */
  public async scan() {
    // get inputs values
    const inputsValues = this.request.only(Object.keys(this.rules));

    for (const input in this.rules) {
      const inputValue = inputsValues[input];
      const inputRules = this.rules[input];

      const rule = new RulesList(input, inputValue, inputRules);

      rule.setRequest(this.request);

      await rule.validate();

      if (rule.fails()) {
        this.errorsList.push(rule.errors());
      }
    }
  }

  /**
   * Check if validator fails
   */
  public fails() {
    return this.errorsList.length > 0;
  }

  /**
   * Check if validator passes
   */
  public passes() {
    return this.errorsList.length === 0;
  }

  /**
   * Get errors list
   */
  public errors() {
    return this.errorsList;
  }
}
