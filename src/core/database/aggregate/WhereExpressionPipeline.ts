import Pipeline from "./pipeline";

export default class WhereExpressionPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(
    protected readonly column: string,
    protected readonly expression: any,
  ) {
    super("match");
    this.data({
      [column]: expression,
    });
  }
}
