import { Request } from "core/http/request";
import RequiredRule from "./rules/required";

export default class RulesList {
  /**
   * Rules list
   */
  public static rulesTypes = {
    required: RequiredRule,
  };

  /**
   * Errors list
   */
  protected errorsList: any = [];

  /**
   * Request instance
   */
  protected request!: Request;

  /**
   * Constructor
   */
  public constructor(
    protected readonly input: string,
    protected readonly value: any,
    protected readonly rules: any,
  ) {
    //
  }

  /**
   * Set request
   */
  public setRequest(request: Request) {
    this.request = request;

    return this;
  }

  /**
   * Validate the rules
   */
  public async validate() {
    for (const ruleName of this.rules) {
      const RuleClass = (RulesList.rulesTypes as any)[ruleName];

      const rule = new RuleClass(this.input, this.value);

      await rule.validate();

      if (rule.fails()) {
        this.errorsList.push(rule.error());
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
