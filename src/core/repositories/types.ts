import { WhereOperator } from "core/database";

export type RepositoryEvent =
  | "listing"
  | "list"
  | "creating"
  | "create"
  | "updating"
  | "update"
  | "saving"
  | "save"
  | "patching"
  | "patch"
  | "deleting"
  | "delete";

export type FilterByOption =
  | {
      option: string;
      column?: string;
    }
  | string;

export type FilterOptionType =
  | "bool"
  | "boolean"
  | "number"
  | "inNumber"
  | "int"
  | "integer"
  | "inInt"
  | "float"
  | "double"
  | "inFloat"
  | "date"
  | "inDate"
  | "date>"
  | "date>="
  | "date<"
  | "date<="
  | "dateBetween"
  | "dateTime"
  | "inDateTime"
  | "dateTime>"
  | "dateTime>="
  | "dateTime<"
  | "dateTime<="
  | "dateTimeBetween"
  | "location"
  | WhereOperator;

export type FilterByOptions = {
  [key in FilterOptionType]?: FilterByOption[];
};

export type RepositoryOptions = {
  paginate?: boolean;
  limit?: number;
  orderBy?: [string, "asc" | "desc"];
  [key: string]: any;
};
