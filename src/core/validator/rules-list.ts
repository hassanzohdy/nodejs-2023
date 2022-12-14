import config from "@mongez/config";
import chalk from "chalk";
import Rule from "./rules/rule";

export default class RulesList {
  /**
   * Errors list
   */
  protected errorsList: any = [];

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
   * Validate the rules
   */
  public async validate() {
    for (const ruleName of this.rules) {
      let rule: Rule;

      if (ruleName instanceof Rule) {
        rule = ruleName;
      } else {
        const RuleClass = config.get(`validation.rules.${ruleName}`);

        if (!RuleClass) {
          throw new Error(
            chalk.bold(
              `Missing Validation Rule: ${chalk.redBright(
                ruleName + " rule",
              )} is not listed under the configurations of ${chalk.cyan(
                "validation.rules",
              )} list`,
            ),
          );
        }

        rule = new RuleClass();
      }

      rule.setInput(this.input).setValue(this.value);

      await rule.validate();

      if (rule.fails()) {
        this.errorsList.push(rule.error());

        if (config.get("validation.stopOnFirstFailure", true)) {
          break;
        }
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
    const returnErrorStrategy = config.get(
      "validation.returnErrorStrategy",
      "first",
    );
    const inputKey = config.get("validation.keys.inputKey", "input");
    const inputError = config.get("validation.keys.inputError", "error");
    const inputErrors = config.get("validation.keys.inputErrors", "errors");

    if (returnErrorStrategy === "first") {
      return {
        [inputKey]: this.input,
        [inputError]: this.errorsList[0],
      };
    }

    return {
      [inputKey]: this.input,
      [inputErrors]: this.errorsList,
    };
  }
}
