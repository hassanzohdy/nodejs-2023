import { GenericObject } from "@mongez/reinforcements/cjs/types";
import { parsePipelines } from "./parsePipelines";
import Pipeline from "./pipeline";

export default class LookupPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(
    protected readonly from: string,
    protected readonly localField: string,
    protected readonly foreignField: string,
    protected readonly as: string,
    protected readonly pipelines: (Pipeline | GenericObject)[] = [],
  ) {
    super("lookup");

    this.data({
      from,
      localField,
      foreignField,
      as,
      pipeline: parsePipelines(pipelines),
    });
  }
}
