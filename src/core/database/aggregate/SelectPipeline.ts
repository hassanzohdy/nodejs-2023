import Pipeline from "./pipeline";

export default class SelectPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(
    protected readonly columns: string[] | Record<string, 0 | 1 | boolean>,
  ) {
    super("project");
    const selections: Record<string, 0 | 1> = {};

    if (Array.isArray(columns)) {
      this.data(
        columns.reduce((selections, column) => {
          selections[column] = 1;

          return selections;
        }, selections),
      );
    } else {
      for (const column in columns) {
        selections[column] = columns[column] ? 1 : 0;
      }

      this.data(selections);
    }
  }
}

export function select(columns: string[] | Record<string, 0 | 1 | boolean>) {
  return new SelectPipeline(columns);
}
