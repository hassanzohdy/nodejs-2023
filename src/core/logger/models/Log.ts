import { Model } from "core/database";
import { Casts, CollectionDocument } from "core/database/model/types";

export type LogData = CollectionDocument<{
  module: string;
  action: string;
  message: string;
  trace: any;
  level: string;
}>;

export default class Log extends Model {
  /**
   * Collection name
   */
  public static collection = "logs";

  protected casts: Casts = {
    module: "string",
    action: "string",
    message: "string",
    trace: "object",
    level: "string",
  };
}
