import { GenericObject } from "@mongez/reinforcements/cjs/types";
import { Model } from "core/database";
import Resource from "./resource";

/**
 * Built in casts
 */
export type OutputCastType =
  | "string"
  | "number"
  | "boolean"
  | "float"
  | "integer"
  | "double"
  | "date"
  | "url"
  | "uploadsUrl"
  | "publicUrl"
  | "assetsUrl";

/**
 * Resource output
 */
export type ResourceOutput = Record<
  string,
  OutputCastType | typeof Resource | ((value: any) => Promise<any> | any)
>;

/**
 * Allowed resource data
 */
export type ResourceData = GenericObject | typeof Model | typeof Resource;
