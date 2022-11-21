import config from "@mongez/config";
import events from "@mongez/events";
import { only } from "@mongez/reinforcements";
import { Route } from "core/router/types";
import { Validator } from "core/validator";
import { FastifyRequest } from "fastify";
import { RequestEvent } from "./types";
import UploadedFile from "./UploadedFile";

export class Request {
  /**
   * Fastify Request object
   */
  public request: any;

  /**
   * Fastify Response eObject
   */
  public response: any;

  /**
   * Current Route
   */
  private route!: Route;

  /**
   * Set request handler
   */
  public setRequest(request: FastifyRequest) {
    this.request = request;

    return this;
  }

  /**
   * Set response handler
   */
  public setResponse(response: any) {
    this.response = response;

    return this;
  }

  /**
   * Set current route
   */
  public setRoute(route: Route) {
    this.route = route;

    return this;
  }

  /**
   * Trigger the given event
   */
  protected trigger(event: RequestEvent, ...args: any[]) {
    return events.trigger(`request.${event}`, ...args);
  }

  /**
   * Listen to the given event name
   */
  public on(event: RequestEvent, callback: any) {
    return events.subscribe(`request.${event}`, callback);
  }

  /**
   * Execute the request
   */
  public async execute() {
    const middlewareExecutingResult = await this.executeMiddleware();

    if (middlewareExecutingResult) {
      return middlewareExecutingResult;
    }

    const handler = this.route.handler;

    const validation = handler.validation;

    const validationResult = await this.validate(validation);

    if (validationResult) {
      return validationResult;
    }

    this.trigger("executingAction", this, this.response);

    const output = await handler(this, this.response);

    this.trigger("executedAction", this, this.response);

    return output;
  }

  /**
   * Execute middleware
   */
  protected async executeMiddleware() {
    const middlewares = this.route.middleware;

    if (!middlewares || middlewares.length === 0) return;

    this.trigger("executingMiddleware", middlewares, this, this.response);

    for (const middleware of middlewares) {
      // call the middleware and wait for its response
      // if the middleware returns a value
      // then stop calling the rest of middleware and do not call the handler
      const output = await middleware(this, this.response);

      if (output) {
        return output;
      }
    }

    // end of middleware
    this.trigger("executedMiddleware", middlewares, this, this.response);
  }

  /**
   * Validate the request
   */
  protected async validate(validation: any) {
    if (!validation) return;

    if (validation.rules) {
      const validator = new Validator(this, validation.rules);

      try {
        await validator.scan(); // start scanning the rules
      } catch (error) {
        console.log(error);
      }

      if (validator.fails()) {
        const responseErrorsKey = config.get(
          "validation.keys.response",
          "errors",
        );
        const responseStatus = config.get("validation.responseStatus", 400);

        return this.response.status(responseStatus).send({
          [responseErrorsKey]: validator.errors(),
        });
      }
    }

    if (validation.validate) {
      const result = await validation.validate(this, this.response);

      if (result) {
        return result;
      }
    }
  }

  /**
   * Get request input value from query string, params or body
   */
  public input(key: string, defaultValue: any = null) {
    return (
      this.request.params[key] ||
      this.request.query[key] ||
      this.body[key] ||
      defaultValue
    );
  }

  /**
   * Get request body
   */
  public get body() {
    const body: any = {};
    for (const key in this.request.body) {
      const keyData = this.request.body[key];

      if (Array.isArray(keyData)) {
        body[key] = keyData.map(this.parseInputValue.bind(this));
      } else {
        body[key] = this.parseInputValue(keyData);
      }
    }

    return body;
  }

  /**
   * Parse the given data
   */
  private parseInputValue(data: any) {
    // data.value appears only in the multipart form data
    // if it json, then just return the data
    if (data.file) return data;

    if (data.value !== undefined) return data.value;

    return data;
  }

  /**
   * Get request file in UploadedFile instance
   */
  public file(key: string): UploadedFile | null {
    const file = this.input(key);

    return file ? new UploadedFile(file) : null;
  }

  /**
   * Get request params
   */
  public get params() {
    return this.request.params;
  }

  /**
   * Get request query
   */
  public get query() {
    return this.request.query;
  }

  /**
   * Get all inputs
   */
  public all() {
    return {
      ...this.body,
      ...this.params,
      ...this.query,
    };
  }

  /**
   * Get only the given keys from the request data
   */
  public only(keys: string[]) {
    return only(this.all(), keys);
  }

  /**
   * Get boolean input value
   */
  public bool(key: string, defaultValue = false) {
    const value = this.input(key, defaultValue);

    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    return Boolean(value);
  }

  /**
   * Get integer input value
   */
  public int(key: string, defaultValue = 0) {
    const value = this.input(key, defaultValue);

    return parseInt(value);
  }

  /**
   * Get float input value
   */
  public float(key: string, defaultValue = 0) {
    const value = this.input(key, defaultValue);

    return parseFloat(value);
  }

  /**
   * Get number input value
   */
  public number(key: string, defaultValue = 0) {
    const value = Number(this.input(key, defaultValue));

    return isNaN(value) ? defaultValue : value;
  }
}

const request = new Request();

export default request;
