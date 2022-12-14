export default class Pipeline {
  /**
   * Pipeline data
   */
  protected pipelineData: any = {};

  /**
   * Constructor
   */
  public constructor(public readonly name: string) {
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
   * Get pipeline data
   */
  public getData() {
    return this.pipelineData;
  }

  /**
   * Parse the pipeline
   */
  public parse() {
    return {
      ["$" + this.name]: this.pipelineData,
    };
  }

  /**
   * Pipeline order
   * The lower the number, the higher the priority
   */
  public sortOrder() {
    return 0;
  }
}
