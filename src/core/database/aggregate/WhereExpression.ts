import Is from "@mongez/supportive-is";
import { Filter } from "../model";

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

export default class WhereExpression {
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
   * Where query
   */
  public static parse(column: string, value: any): Filter;
  public static parse(filter: Filter): Filter;
  public static parse(
    column: string,
    operator: WhereOperator,
    value: any,
  ): Filter;
  public static parse(...args: any[]) {
    if (args.length === 1 && Is.plainObject(args[0])) return args[0];

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
      [WhereExpression.operators[operator as WhereOperator]]: value,
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

export const where = WhereExpression.parse;
