export default class Pipeline {
  /**
   * Pipeline data
   */
  protected pipelineData: any = {};

  /**
   * Constructor
   */
  public constructor(protected readonly name: string) {
    //
  }

  /**
   * Set a pipeline data
   */
  public data(data: any) {
    this.pipelineData = data;

    return this;
  }

  /**
   * Parse the pipeline
   */
  public parse() {
    return {
      ["$" + this.name]: this.pipelineData,
    };
  }
}
