import Pipeline from "./pipeline";

export default class SortRandomPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(protected readonly size: number) {
    super("sample");

    this.data({
      size,
    });
  }
}
