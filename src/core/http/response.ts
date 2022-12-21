import events, { EventSubscription } from "@mongez/events";
import Is from "@mongez/supportive-is";
import { Route } from "core/router/types";
import { FastifyReply } from "fastify";
import fs from "fs";
import { ResponseEvent } from "./types";

export class Response {
  /**
   * Current route
   */
  protected route?: Route;

  /**
   * Fastify response object
   */
  protected baseResponse!: FastifyReply;

  /**
   * Current status code
   */
  protected currentStatusCode?: number;

  /**
   * Current response body
   */
  protected currentBody: any;

  /**
   * Get Current response body
   */
  public get body() {
    return this.currentBody;
  }

  /**
   * Set the Fastify response object
   */
  setResponse(response: FastifyReply) {
    this.baseResponse = response;

    return this;
  }

  /**
   * Reset the response state
   */
  public reset() {
    this.route = undefined;
    this.currentBody = null;
    this.currentStatusCode = 200;
  }

  /**
   * Set current route
   */
  public setRoute(route: Route) {
    this.route = route;

    return this;
  }

  /**
   * Get the content type
   */
  public get contentType() {
    return this.baseResponse.getHeader("Content-Type");
  }

  /**
   * Get the status code
   */
  public get statusCode() {
    return this.baseResponse.statusCode;
  }

  /**
   * Check if the response has been sent
   */
  public get sent() {
    return this.baseResponse.sent;
  }

  /**
   * Add a listener to the response event
   */
  protected on(
    event: ResponseEvent,
    listener: (...args: any[]) => void,
  ): EventSubscription {
    return events.subscribe(event, listener);
  }

  /**
   * Trigger the response event
   */
  protected trigger(event: ResponseEvent, ...args: any[]) {
    events.trigger(event, ...args);
  }

  /**
   * Parse body
   */
  protected async parseBody() {
    return await this.parse(this.currentBody);
  }

  /**
   * Parse the given value
   */
  protected async parse(value: any): Promise<any> {
    // if it is a falsy value, return it
    if (!value || Is.scalar(value)) return value;

    // if it has a `toJSON` method, call it and await the result then return it
    if (value.toJSON) {
      return await value.toJSON();
    }

    // if it is iterable, an array or array-like object then parse each item
    if (Is.iterable(value)) {
      const values = Array.from(value);

      return Promise.all(
        values.map(async (item: any) => {
          return await this.parse(item);
        }),
      );
    }

    // if not plain object, then return it
    if (!Is.plainObject(value)) {
      return value;
    }

    // loop over the object and check if the value and call `parse` on it
    for (const key in value) {
      const subValue = value[key];

      value[key] = await this.parse(subValue);
    }

    return value;
  }

  /**
   * Send the response
   */
  public async send(data?: any, statusCode?: number) {
    if (data === this) return this;

    if (data) {
      this.currentBody = data;
    }

    // parse the body and make sure it is transformed to sync data instead of async data
    data = await this.parseBody();

    if (statusCode) {
      this.currentStatusCode = statusCode;
    }

    if (!this.currentStatusCode) {
      this.currentStatusCode = 200;
    }

    // trigger the sending event
    this.trigger("sending", this.currentStatusCode, data);

    this.baseResponse.status(this.currentStatusCode).send(data);

    // trigger the sent event
    this.trigger("sent", this.currentStatusCode, data);

    // trigger the success event if the status code is 2xx
    if (this.currentStatusCode >= 200 && this.currentStatusCode < 300) {
      this.trigger("success", data, this.currentStatusCode, this.route);
    }

    // trigger the successCreate event if the status code is 201
    if (this.currentStatusCode === 201) {
      this.trigger("successCreate", data, this.currentStatusCode, this.route);
    }

    // trigger the badRequest event if the status code is 400
    if (this.currentStatusCode === 400) {
      this.trigger("badRequest", data, this.currentStatusCode, this.route);
    }

    // trigger the unauthorized event if the status code is 401
    if (this.currentStatusCode === 401) {
      this.trigger("unauthorized", data, this.currentStatusCode, this.route);
    }

    // trigger the forbidden event if the status code is 403
    if (this.currentStatusCode === 403) {
      this.trigger("forbidden", data, this.currentStatusCode, this.route);
    }

    // trigger the notFound event if the status code is 404
    if (this.currentStatusCode === 404) {
      this.trigger("notFound", data, this.currentStatusCode, this.route);
    }

    // trigger the throttled event if the status code is 429
    if (this.currentStatusCode === 429) {
      this.trigger("throttled", data, this.currentStatusCode, this.route);
    }

    // trigger the serverError event if the status code is 500
    if (this.currentStatusCode === 500) {
      this.trigger("serverError", data, this.currentStatusCode, this.route);
    }

    // trigger the error event if the status code is 4xx or 5xx
    if (this.currentStatusCode >= 400) {
      this.trigger("error", data, this.currentStatusCode, this.route);
    }

    return this;
  }

  /**
   * Set the content type
   */
  public setContentType(contentType: string) {
    this.baseResponse.header("Content-Type", contentType);

    return this;
  }

  /**
   * Set the status code
   */
  public setStatusCode(statusCode: number) {
    this.currentStatusCode = statusCode;

    return this;
  }

  /**
   * Redirect the user to another route
   */
  public redirect(url: string, statusCode = 302) {
    this.baseResponse.redirect(statusCode, url);

    return this;
  }

  /**
   * Get the response time
   */
  public getResponseTime() {
    return this.baseResponse.getResponseTime();
  }

  /**
   * Remove a specific header
   */
  public removeHeader(key: string) {
    this.baseResponse.removeHeader(key);

    return this;
  }

  /**
   * Get a specific header
   */
  public getHeader(key: string) {
    return this.baseResponse.getHeader(key);
  }

  /**
   * Get the response headers
   */
  public getHeaders() {
    return this.baseResponse.getHeaders();
  }

  /**
   * Set multiple headers
   */
  public headers(headers: Record<string, string>) {
    this.baseResponse.headers(headers);

    return this;
  }

  /**
   * Set the response header
   */
  public header(key: string, value: string) {
    this.baseResponse.header(key, value);

    return this;
  }

  /**
   * Send an error response with status code 500
   */
  public serverError(data: any) {
    return this.send(data, 500);
  }

  /**
   * Send a forbidden response with status code 403
   */
  public forbidden(data: any) {
    return this.send(data, 403);
  }

  /**
   * Send an unauthorized response with status code 401
   */
  public unauthorized(data: any) {
    return this.send(data, 401);
  }

  /**
   * Send a not found response with status code 404
   */
  public notFound(
    data: any = {
      error: "notFound",
    },
  ) {
    return this.send(data, 404);
  }

  /**
   * Send a bad request response with status code 400
   */
  public badRequest(data: any) {
    return this.send(data, 400);
  }

  /**
   * Send a success response with status code 201
   */
  public successCreate(data: any) {
    return this.send(data, 201);
  }

  /**
   * Send a success response
   */
  public success(data: any = { success: true }) {
    return this.send(data);
  }

  /**
   * Send a file as a response
   */
  public sendFile(path: string) {
    if (!fs.existsSync(path)) {
      throw new Error(`Response Send Failed:  File not found: ${path}`);
    }

    const fileContent = fs.readFileSync(path);

    this.baseResponse.send(fileContent);

    return this;
  }
}

const response = new Response();

export default response;
