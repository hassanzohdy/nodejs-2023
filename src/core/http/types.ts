import { Response } from "./response";

export type RequestEvent =
  | "executingMiddleware"
  | "executedMiddleware"
  | "executingAction"
  | "executedAction";

/**
 * Allowed response type
 */
export type ReturnedResponse =
  /**
   * Can be a response object
   */
  | Response
  /**
   * Or a promise returning a response object
   */
  | Promise<Response>
  /**
   * Or an object
   */
  | Record<string, any>
  /**
   * Or a promise returning an object
   */
  | Promise<Record<string, any>>
  /**
   * Or an array
   */
  | any[]
  /**
   * Or a promise returning an array
   */
  | Promise<any[]>;

/**
 * Response Event Types
 */
export type ResponseEvent =
  /**
   * Triggered before sending the response
   */
  | "sending"
  /**
   * Triggered after sending the response regardless of the response status code
   */
  | "sent"
  /**
   * Triggered after sending the response if the response status code is 2xx
   */
  | "success"
  /**
   * Triggered after sending the response if the response status code is 201
   */
  | "successCreate"
  /**
   * Triggered after sending the response if the response status code is 400
   */
  | "badRequest"
  /**
   * Triggered after sending the response if the response status code is 401
   */
  | "unauthorized"
  /**
   * Triggered after sending the response if the response status code is 403
   */
  | "forbidden"
  /**
   * Triggered after sending the response if the response status code is 404
   */
  | "notFound"
  /**
   * Triggered after sending the response if the response status code is 429
   */
  | "throttled"
  /**
   * Triggered after sending the response if the response status code is 500
   */
  | "serverError"
  /**
   * Triggered after sending the response if the response status code is 4xx or 5xx
   */
  | "error";
