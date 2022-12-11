import { GenericObject } from "@mongez/reinforcements/cjs/types";
import { parsePipelines } from "./parsePipelines";
import Pipeline from "./pipeline";

export type LookupPipelineOptions = {
  from: string;
  localField?: string;
  foreignField?: string;
  as?: string;
  single?: boolean;
  pipeline?: (Pipeline | GenericObject)[];
  let?: GenericObject;
};

export default class LookupPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(options: LookupPipelineOptions) {
    super("lookup");

    const { from, localField, foreignField, as, pipeline = [] } = options;

    this.data({
      from,
      localField,
      foreignField,
      as,
      pipeline: parsePipelines(pipeline),
    });
  }
}
