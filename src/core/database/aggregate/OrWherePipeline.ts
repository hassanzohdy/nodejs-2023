import WherePipeline from "./WherePipeline";

export default class OrWherePipeline extends WherePipeline {
  /**
   * {@inheritDoc}
   */
  public parse() {
    const data = [];

    for (const column in this.pipelineData) {
      data.push({
        [column]: this.pipelineData[column],
      });
    }

    return {
      $match: {
        $or: data,
      },
    };
  }
}
