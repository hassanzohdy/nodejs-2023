import { GenericObject } from "@mongez/reinforcements/cjs/types";
import Pipeline from "./pipeline";

export function parsePipelines(pipelines: (Pipeline | GenericObject)[]) {
  return pipelines.map(parsePipeline);
}

export function parsePipeline(pipeline: Pipeline | GenericObject) {
  return pipeline.parse ? pipeline.parse() : pipeline;
}
