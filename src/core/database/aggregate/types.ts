export const whereOperators = [
  "=",
  "!=",
  "not",
  ">",
  ">=",
  "<",
  "<=",
  "in",
  "nin",
  "notIn",
  "all",
  "exists",
  "type",
  "mod",
  "regex",
  "geoIntersects",
  "geoWithin",
  "near",
  "between",
  "notBetween",
  "nearSphere",
  "elemMatch",
  "size",
  "like",
  "notLike",
] as const;

// export type WhereOperator  where it is  type is one of where operator's array values
export type WhereOperator = typeof whereOperators[number];

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
  | "$size";

export type GeoLocation = {
  lat: number;
  lng: number;
};
