import { ltrim } from "@mongez/reinforcements";
import { GenericObject } from "@mongez/reinforcements/cjs/types";
import Is from "@mongez/supportive-is";

/**
 * Get count expression
 */
export function count() {
  return {
    $sum: 1,
  };
}

/**
 * Get sum expression
 */
export function sum(column: string) {
  return {
    $sum: `$${column}`,
  };
}

/**
 * Get average expression
 */
export const average = avg;
export function avg(column: string) {
  return {
    $avg: `$${column}`,
  };
}

/**
 * Get min expression
 */
export function min(column: string) {
  return {
    $min: `$${column}`,
  };
}

/**
 * Get max expression
 */
export function max(column: string) {
  return {
    $max: `$${column}`,
  };
}

/**
 * Get first expression
 */
export function first(column: string) {
  return {
    $first: `$${column}`,
  };
}

/**
 * Get last expression
 */
export function last(column: string) {
  return {
    $last: `$${column}`,
  };
}

/**
 * Get push expression
 */
export function push(column: string) {
  return {
    $push: `$${column}`,
  };
}

/**
 * Get addToSet expression
 */
export function addToSet(column: string) {
  return {
    $addToSet: `$${column}`,
  };
}

/**
 * Get year expression
 */
export function year(column: string) {
  return {
    $year: `$${column}`,
  };
}

/**
 * Get first value of year expression
 */
export function firstYear(column: string) {
  return {
    $first: {
      $year: `$${column}`,
    },
  };
}

/**
 * Get last value of year expression
 */
export function lastYear(column: string) {
  return {
    $last: {
      $year: `$${column}`,
    },
  };
}

/**
 * Get month expression
 */
export function month(column: string) {
  return {
    $month: `$${column}`,
  };
}

/**
 * Get first value of month expression
 */
export function firstMonth(column: string) {
  return {
    $first: {
      $month: `$${column}`,
    },
  };
}

/**
 * Get last value of month expression
 */
export function lastMonth(column: string) {
  return {
    $last: {
      $month: `$${column}`,
    },
  };
}

/**
 * Get day of month expression
 */
export const day = dayOfMonth;
export function dayOfMonth(column: string) {
  return {
    $dayOfMonth: `$${column}`,
  };
}

/**
 * Get first day of month expression
 */
export function firstDayOfMonth(column: string) {
  return {
    $first: {
      $dayOfMonth: `$${column}`,
    },
  };
}

/**
 * Get last day of month expression
 */
export function lastDayOfMonth(column: string) {
  return {
    $last: {
      $dayOfMonth: `$${column}`,
    },
  };
}

/**
 * Get day of week expression
 */
export function dayOfWeek(column: string) {
  return {
    $dayOfWeek: `$${column}`,
  };
}

/**
 * Return list of columns
 */
export function columns(...columns: string[]) {
  return columns.reduce((selections: GenericObject, column) => {
    selections[column] = `$${column}`;

    return selections;
  }, {});
}

/** Match helpers */

/**
 * Get greater than expression
 */
export const greaterThan = gt;
export function gt(value: any) {
  return {
    $gt: value,
  };
}

/**
 * Get greater than or equal expression
 */
export const greaterThanOrEqual = gt;
export function gte(value: any) {
  return {
    $gte: value,
  };
}

/**
 * Get less than expression
 */
export const lessThan = lt;
export function lt(value: any) {
  return {
    $lt: value,
  };
}

/**
 * Get less than or equal expression
 */
export const lessThanOrEqual = lt;
export function lte(value: any) {
  return {
    $lte: value,
  };
}

/**
 * Get equal expression
 */
export const equal = eq;
export function eq(value: any) {
  return {
    $eq: value,
  };
}

/**
 * Get not equal expression
 */
export const notEqual = ne;
export function ne(value: any) {
  return {
    $ne: value,
  };
}

/**
 * Get in array expression
 */
export function inArray(value: any) {
  return {
    $in: value,
  };
}

/**
 * Get not in array expression
 */
export const notIn = nin;
export const notInArray = nin;
export function nin(value: any) {
  return {
    $nin: value,
  };
}

/**
 * Get exists expression
 */
export function exists(value: any) {
  return {
    $exists: value,
  };
}

/**
 * Get not exists expression
 */
export function notExists(value: any) {
  return {
    $not: {
      $exists: value,
    },
  };
}

/**
 * Get like expression
 */
export function like(value: any) {
  if (Is.scalar(value)) {
    value = new RegExp(value, "i");
  }

  return {
    $regex: value,
  };
}

/**
 * Get not like expression
 */
export function notLike(value: any) {
  if (Is.scalar(value)) {
    value = new RegExp(value, "i");
  }

  return {
    $not: {
      $regex: value,
    },
  };
}

/**
 * Get not null expression
 */
export function notNull() {
  return {
    $ne: null,
  };
}

/**
 * Get null expression
 */
export function isNull() {
  return {
    $eq: null,
  };
}

/**
 * Get between expression
 */
export function between(minValue: any, maxValue: any) {
  return {
    $gte: minValue,
    $lte: maxValue,
  };
}

/**
 * Get not between expression
 */
export function notBetween(minValue: any, maxValue: any) {
  return {
    $not: {
      $gte: minValue,
      $lte: maxValue,
    },
  };
}

/**
 * Get concat expression
 */
export function concat(...columns: string[]) {
  return {
    $concat: columns.map(column => "$" + ltrim(column, "$")),
  };
}

/**
 * Concat columns with separator
 */
export function concatWith(separator: string, ...columns: string[]) {
  return {
    $concat: [separator, ...columns.map(column => "$" + ltrim(column, "$"))],
  };
}

/**
 * Get cond expression
 */
export function cond(condition: any, ifTrue: any, ifFalse: any) {
  return {
    $cond: {
      if: condition,
      then: ifTrue,
      else: ifFalse,
    },
  };
}

/**
 * Get regex expression
 */
export function regex(value: RegExp) {
  return {
    $regex: value,
  };
}
