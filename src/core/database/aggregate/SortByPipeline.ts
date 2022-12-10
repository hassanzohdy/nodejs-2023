import Pipeline from "./pipeline";

export default class SortByPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(
    protected readonly columns: Record<string, "desc" | "asc">,
  ) {
    super("sort");

    const data: Record<string, number> = {};

    for (const column in columns) {
      data[column] = columns[column] === "asc" ? 1 : -1;
    }

    this.data(data);
  }
}
