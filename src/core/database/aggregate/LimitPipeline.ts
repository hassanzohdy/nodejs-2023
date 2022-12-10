import Pipeline from "./pipeline";

export default class LimitPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(protected readonly limit: number) {
    super("limit");

    this.data(limit);
  }
}
