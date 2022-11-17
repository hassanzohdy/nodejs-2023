import { Request } from "core/http/request";
import { Response } from "core/http/response";
import { ReturnedResponse } from "core/http/types";

/**
 * Middleware method
 * Receives the request and response objects
 * And returns a response object or undefined if the request should continue
 */
export type Middleware = (
  request: Request,
  response: Response,
) => ReturnedResponse | undefined;

/**
 * Route handler receives a request and a response
 * And returns a returning response type
 */
export type RouteHandler = {
  /**
   * Function Declaration
   */
  (request: Request, response: Response): ReturnedResponse;

  /**
   * Validation static object property which can be optional
   */
  validation?: {
    /**
     * Validation rules
     */
    rules?: Record<string, any>;
    /**
     * Validation custom message
     */
    validate?: Middleware;
  };
};

export type RouteOptions = {
  /**
   * Route middleware
   */
  middleware?: Middleware[];
  /**
   * Route name
   */
  name?: string;
};

/**
 * Route Object
 */
export type Route = RouteOptions & {
  /**
   * Route method
   */
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /**
   * Route path
   */
  path: string;
  /**
   * Route handler Can be a function
   * And als can have a `validation` object as a static property of the handler
   */
  handler: RouteHandler;
};
