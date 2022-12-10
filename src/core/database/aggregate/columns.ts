import { ltrim } from "@mongez/reinforcements";
import { GenericObject } from "@mongez/reinforcements/cjs/types";
import Is from "@mongez/supportive-is";

export function count(outputAs = "count") {
  return {
    [outputAs]: {
      $sum: 1,
    },
  };
}

export function sum(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $sum: `$${column}`,
    },
  };
}

export const average = avg;
export function avg(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $avg: `$${column}`,
    },
  };
}

export function min(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $min: `$${column}`,
    },
  };
}

export function max(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $max: `$${column}`,
    },
  };
}

export function first(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $first: `$${column}`,
    },
  };
}

export function last(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $last: `$${column}`,
    },
  };
}

export function push(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $push: `$${column}`,
    },
  };
}

export function addToSet(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $addToSet: `$${column}`,
    },
  };
}

export function add(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $add: `$${column}`,
    },
  };
}

export function year(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $year: `$${column}`,
    },
  };
}

export function firstYear(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $first: {
        $year: `$${column}`,
      },
    },
  };
}

export function lastYear(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $last: {
        $year: `$${column}`,
      },
    },
  };
}

export function month(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $month: `$${column}`,
    },
  };
}

export function firstMonth(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $first: {
        $month: `$${column}`,
      },
    },
  };
}

export function lastMonth(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $last: {
        $month: `$${column}`,
      },
    },
  };
}

export function dayOfMonth(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $dayOfMonth: `$${column}`,
    },
  };
}

export function firstDayOfMonth(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $first: {
        $dayOfMonth: `$${column}`,
      },
    },
  };
}

export function lastDayOfMonth(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $last: {
        $dayOfMonth: `$${column}`,
      },
    },
  };
}

export function day(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $dayOfMonth: `$${column}`,
    },
  };
}

export function dayOfWeek(column: string, outputAs = column) {
  return {
    [outputAs]: {
      $dayOfWeek: `$${column}`,
    },
  };
}

export function columns(...columns: string[]) {
  return columns.reduce((selections: GenericObject, column) => {
    selections[column] = `$${column}`;

    return selections;
  }, {});
}

/** Match helpers */
export const greaterThan = gt;
export function gt(value: any) {
  return {
    $gt: value,
  };
}

export const greaterThanOrEqual = gt;
export function gte(value: any) {
  return {
    $gte: value,
  };
}

export const lessThan = lt;
export function lt(value: any) {
  return {
    $lt: value,
  };
}

export const lessThanOrEqual = lt;
export function lte(value: any) {
  return {
    $lte: value,
  };
}

export const equal = eq;
export function eq(value: any) {
  return {
    $eq: value,
  };
}

export const notEqual = ne;
export function ne(value: any) {
  return {
    $ne: value,
  };
}

export function inArray(value: any) {
  return {
    $in: value,
  };
}

export const notIn = nin;
export function nin(value: any) {
  return {
    $nin: value,
  };
}

export function exists(value: any) {
  return {
    $exists: value,
  };
}

export function like(value: any) {
  if (Is.scalar(value)) {
    value = new RegExp(value, "i");
  }

  return {
    $regex: value,
  };
}

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

export function notNull() {
  return {
    $ne: null,
  };
}

export function isNull() {
  return {
    $eq: null,
  };
}

export function between(minValue: any, maxValue: any) {
  return {
    $gte: minValue,
    $lte: maxValue,
  };
}

export function notBetween(minValue: any, maxValue: any) {
  return {
    $not: {
      $gte: minValue,
      $lte: maxValue,
    },
  };
}

export function concat(...columns: string[]) {
  return {
    $concat: columns.map(column => "$" + ltrim(column, "$")),
  };
}

export function concatWith(separator: string, ...columns: string[]) {
  return {
    $concat: [separator, ...columns.map(column => "$" + ltrim(column, "$"))],
  };
}
