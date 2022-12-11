import { GenericObject } from "@mongez/reinforcements/cjs/types";
import Pipeline from "./pipeline";

export default class WherePipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(expression: GenericObject) {
    super("match");

    const expressions = [];

    for (const [column, value] of Object.entries(expression)) {
      expressions.push({
        [column]: value,
      });
    }

    this.data({
      $or: expressions,
    });
  }
}
