import { GenericObject } from "@mongez/reinforcements/cjs/types";
import { add, avg, count, first, last, max, min, push, sum } from "./columns";
import Pipeline from "./pipeline";

export default class GroupByPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(
    protected readonly _id: string | null | GenericObject,
    protected groupByData: GenericObject = {},
  ) {
    super("group");

    this.data({
      _id: this._id,
      ...this.groupByData,
    });
  }

  /**
   * Count the number of results
   */
  public count(outputAs = "count") {
    return count(outputAs);
  }

  /**
   * Sum the given column
   */
  public sum(column: string, outputAs = column) {
    return sum(column, outputAs);
  }

  /**
   * Average the given column
   */
  public avg(column: string, outputAs = column) {
    return avg(column, outputAs);
  }

  /**
   * Minimum value of the given column
   */
  public min(column: string, outputAs = column) {
    return min(column, outputAs);
  }

  /**
   * Maximum value of the given column
   */
  public max(column: string, outputAs = column) {
    return max(column, outputAs);
  }

  /**
   * First value of the given column
   */
  public first(column: string, outputAs = column) {
    return first(column, outputAs);
  }

  /**
   * Last value of the given column
   */
  public last(column: string, outputAs = column) {
    return last(column, outputAs);
  }

  /**
   * Push the given column
   */
  public push(column: string, outputAs = column) {
    return push(column, outputAs);
  }

  /**
   * Add the given column
   */
  public add(column: string, outputAs = column) {
    return add(column, outputAs);
  }
}

export function groupBy(
  column: string | null,
  groupByData: Record<string, any>,
) {
  return new GroupByPipeline(column, groupByData);
}
