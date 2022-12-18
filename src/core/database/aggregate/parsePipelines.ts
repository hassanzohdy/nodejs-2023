import { GenericObject } from "@mongez/reinforcements/cjs/types";
import Pipeline from "./pipeline";

export function parsePipelines(pipelines: (Pipeline | GenericObject)[]) {
  return pipelines
    .sort((pipeline1, pipeline2) => {
      if (!pipeline1.sortOrder) return 1;

      if (!pipeline2.sortOrder) return -1;

      // the lower the number, the higher the priority
      return pipeline1.sortOrder() - pipeline2.sortOrder();
    })
    .map(parsePipeline);
}

export function parsePipeline(pipeline: Pipeline | GenericObject) {
  return pipeline.parse ? pipeline.parse() : pipeline;
}
