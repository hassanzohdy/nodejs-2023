import Pipeline from "./pipeline";

export default class UnwindPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(
    protected readonly column: string,
    protected readonly preserveNullAndEmptyArrays: boolean = false,
  ) {
    super("unwind");

    this.data({
      path: column,
      preserveNullAndEmptyArrays: preserveNullAndEmptyArrays,
    });
  }
}
