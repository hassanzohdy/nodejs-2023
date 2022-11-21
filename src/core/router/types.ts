import { Request } from "core/http/request";

/**
 * Route Middleware
 */
export type Middleware = (request: Request, response: any) => any;

/**
 * Route Options
 */
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
   * Route handler
   */
  handler: any;
};
