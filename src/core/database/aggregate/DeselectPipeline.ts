import Pipeline from "./pipeline";

export default class DeselectPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(protected readonly columns: string[]) {
    super("project");

    this.data(
      columns.reduce((acc: Record<string, 0>, column) => {
        acc[column] = 0;

        return acc;
      }, {}),
    );
  }
}
