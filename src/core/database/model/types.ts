import { ObjectId, WithId } from "mongodb";
import Model from "./model";

/**
 * Primary id type
 */
export type PrimaryIdType = string | number | ObjectId;

/**
 * Base model to be extended with Child Models
 */
export type ChildModel<T> = typeof Model & (new () => T);

/**
 * The result of the paginate query
 */
export type PaginationListing<T> = {
  /**
   * Results of the query
   */
  documents: T[];
  /**
   * The pagination results
   */
  paginationInfo: {
    /**
     * Limit of the query
     */
    limit: number;
    /**
     * Results of the query
     */
    result: number;
    /**
     * Current page of the query
     */
    page: number;
    /**
     * total results of the query
     */
    total: number;
    /**
     * total pages of the query
     */
    pages: number;
  };
};

/**
 * Filter object
 */
export type Filter = Record<string, any>;

/**
 * Document data will be used in insertion, updates or replace
 */
export type Document = Record<string, any>;

/**
 * Model Document that contains the model with both mongodb _id and our custom id
 */
export type ModelDocument = WithId<{
  /**
   * Auto Increment id
   */
  id: number;
  /**
   * Dynamic columns
   */
  [key: string]: any;
}>;
