import { GenericObject } from "@mongez/reinforcements/cjs/types";

export type WhereOperator =
  | "="
  | "!="
  | "not"
  | ">"
  | ">="
  | "<"
  | "<="
  | "in"
  | "nin"
  | "notIn"
  | "all"
  | "exists"
  | "type"
  | "mod"
  | "regex"
  | "geoIntersects"
  | "geoWithin"
  | "near"
  | "between"
  | "notBetween"
  | "nearSphere"
  | "elemMatch"
  | "size"
  | "like"
  | "notLike"
  | "bitsAllClear";

export type MongoDBOperator =
  | "$eq"
  | "$ne"
  | "$gt"
  | "$gte"
  | "$lt"
  | "$lte"
  | "$in"
  | "$nin"
  | "$all"
  | "$exists"
  | "$type"
  | "$mod"
  | "$regex"
  | "$geoIntersects"
  | "$geoWithin"
  | "$between"
  | "$near"
  | "$nearSphere"
  | "$elemMatch"
  | "$size"
  | "$bitsAllClear";

export default class WhereQuery {
  /**
   * Operators pipeline for match
   */
  protected operatorsPipeline: GenericObject = {};

  /**
   * Operators list
   */
  public static readonly operators: Record<WhereOperator, MongoDBOperator> = {
    "=": "$eq",
    "!=": "$ne",
    not: "$ne",
    ">": "$gt",
    ">=": "$gte",
    "<": "$lt",
    "<=": "$lte",
    in: "$in",
    nin: "$nin",
    notIn: "$nin",
    all: "$all",
    exists: "$exists",
    type: "$type",
    mod: "$mod",
    regex: "$regex",
    between: "$between",
    notBetween: "$between",
    geoIntersects: "$geoIntersects",
    geoWithin: "$geoWithin",
    near: "$near",
    nearSphere: "$nearSphere",
    elemMatch: "$elemMatch",
    size: "$size",
    bitsAllClear: "$bitsAllClear",
    like: "$regex",
    notLike: "$regex",
  };

  /**
   * Constructor
   */
  public constructor(protected readonly query: GenericObject) {
    //
  }

  /**
   * Where query
   */
  public where(column: string, value: any): this;
  public where(column: string, operator: WhereOperator, value: any): this;
  public where(...args: any[]) {
    const expression = this.parseWhere(args);

    this.operatorsPipeline = {
      ...this.operatorsPipeline,
      ...expression,
    };

    return this;
  }

  /**
   * Parse the given args
   */
  protected parseWhere(args: any[]) {
    // eslint-disable-next-line prefer-const
    const column: string = args[0];
    let operator: WhereOperator = args[1];
    let value: any = args[2];

    // if the length is two, then the operator will be =
    if (args.length === 2) {
      value = operator;
      operator = "=";
    }

    if (operator === "like") {
      value = new RegExp(value, "i");
    } else if (operator === "notLike") {
      value = new RegExp(value, "i");
      operator = "not";
      value = {
        $regex: value,
      };
    }

    let expression = {
      [WhereQuery.operators[operator as WhereOperator]]: value,
    };

    if (operator === "between") {
      expression = {
        $gte: value[0],
        $lte: value[1],
      };
    } else if (operator === "notBetween") {
      expression = {
        $not: {
          $gte: value[0],
          $lte: value[1],
        },
      };
    }

    // now add the data
    return {
      column,
      expression,
    };
  }
}
