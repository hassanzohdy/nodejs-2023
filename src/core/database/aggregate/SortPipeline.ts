import Pipeline from "./pipeline";

export default class SortPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(
    protected readonly column: string,
    protected readonly direction: "asc" | "desc" = "asc",
  ) {
    super("sort");

    this.data({
      [column]: direction === "asc" ? 1 : -1,
    });
  }
}
