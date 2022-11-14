import events from "@mongez/events";
import { Request } from "core/http/request";
import RulesList from "./rules-list";
import { ValidationEvent } from "./types";

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
   * Trigger the given event with its arguments
   */
  public static trigger(event: ValidationEvent, ...args: any[]) {
    return events.trigger(`validation.${event}`, ...args);
  }

  /**
   * Listen to the given event
   */
  public static on(event: ValidationEvent, callback: any) {
    return events.subscribe(`validation.${event}`, callback);
  }

  /**
   * Scan the validation rules
   */
  public async scan() {
    // get inputs values
    const inputsValues = this.request.only(Object.keys(this.rules));

    // trigger validating events
    Validator.trigger("validating", this.rules, inputsValues, this);

    for (const input in this.rules) {
      const inputValue = inputsValues[input];
      const inputRules = this.rules[input];

      const rulesList = new RulesList(input, inputValue, inputRules);

      await rulesList.validate();

      if (rulesList.fails()) {
        this.errorsList.push(rulesList.errors());
      }
    }

    // validation is done
    // then trigger the done event
    const passes = this.passes();

    Validator.trigger(
      "done",
      passes,
      this.errorsList,
      this.rules,
      inputsValues,
      this,
    );

    if (passes) {
      // trigger the passes event
      Validator.trigger("passes", this.rules, inputsValues, this);
    } else {
      Validator.trigger(
        "fails",
        this.errorsList,
        this.rules,
        inputsValues,
        this,
      );
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
