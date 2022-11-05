import { ObjectId } from "mongodb";
import Model from "./model";

export type ChildModel<T> = typeof Model & (new () => T);

export type PrimaryIdType = string | number | ObjectId;

export type PaginationListing<T> = {
  documents: T[];
  paginationInfo: {
    limit: number;
    result: number;
    page: number;
    total: number;
    pages: number;
  };
};
