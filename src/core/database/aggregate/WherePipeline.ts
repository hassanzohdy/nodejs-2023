import { GenericObject } from "@mongez/reinforcements/cjs/types";
import Pipeline from "./pipeline";

export default class WherePipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(expression: GenericObject) {
    super("match");

    this.data(expression);
  }
}
