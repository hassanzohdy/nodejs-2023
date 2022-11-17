import events from "@mongez/events";
import { get, only } from "@mongez/reinforcements";
import { Route } from "core/router/types";
import { validateAll } from "core/validator";
import { FastifyReply, FastifyRequest } from "fastify";
import response, { Response } from "./response";
import { RequestEvent } from "./types";
import UploadedFile from "./UploadedFile";

export class Request {
  /**
   * Fastify Request object
   */
  public baseRequest!: FastifyRequest;

  /**
   * Response Object
   */
  protected response: Response = response;

  /**
   * Route Object
   */
  private route!: Route;

  /**
   * Parsed Request Payload
   */
  protected payload: any = {};

  /**
   * Set request handler
   */
  public setRequest(request: FastifyRequest) {
    this.baseRequest = request;

    this.parsePayload();

    return this;
  }

  /**
   * Parse the payload and merge it from the request body, params and query string
   */
  protected parsePayload() {
    this.payload.body = this.parseBody();
    this.payload.query = this.baseRequest.query;
    this.payload.params = this.baseRequest.params;
    this.payload.all = {
      ...this.payload.body,
      ...this.payload.query,
      ...this.payload.params,
    };
  }

  /**
   * Parse body payload
   */
  private parseBody() {
    const body: any = {};
    const requestBody = this.baseRequest.body as Record<string, any>;

    for (const key in requestBody) {
      const keyData = requestBody[key];

      if (Array.isArray(keyData)) {
        body[key] = keyData.map(this.parseInputValue.bind(this));
      } else {
        body[key] = this.parseInputValue(keyData);
      }
    }

    return body;
  }

  /**
   * Set Fastify response
   */
  public setResponse(response: FastifyReply) {
    this.response.setResponse(response);

    return this;
  }

  /**
   * Set route handler
   */
  public setRoute(route: Route) {
    this.route = route;

    // pass the route to the response object
    this.response.setRoute(route);

    return this;
  }

  /**
   * Trigger an http event
   */
  protected trigger(eventName: RequestEvent, ...args: any[]) {
    return events.trigger(`request.${eventName}`, ...args, this);
  }

  /**
   * Listen to the given event
   */
  public on(eventName: RequestEvent, callback: any) {
    return this.trigger(eventName, callback);
  }

  /**
   * Execute the request
   */
  public async execute() {
    // check for middleware first
    const middlewareOutput = await this.executeMiddleware();

    if (middlewareOutput !== undefined) {
      return middlewareOutput;
    }

    const handler = this.route.handler;

    // 👇🏻 check for validation using validateAll helper function
    const validationOutput = await validateAll(
      handler.validation,
      this,
      this.response,
    );

    if (validationOutput !== undefined) {
      return validationOutput;
    }

    // call executingAction event
    this.trigger("executingAction", this.route);
    const output = await handler(this, this.response);

    // call executedAction event
    this.trigger("executedAction", this.route);

    return output;
  }

  /**
   * Execute middleware list of current route
   */
  protected async executeMiddleware() {
    if (!this.route.middleware || this.route.middleware.length === 0) return;

    // trigger the executingMiddleware event
    this.trigger("executingMiddleware", this.route.middleware, this.route);

    for (const middleware of this.route.middleware) {
      const output = await middleware(this, this.response);

      if (output !== undefined) {
        this.trigger("executedMiddleware");
        return output;
      }
    }

    // trigger the executedMiddleware event
    this.trigger("executedMiddleware", this.route.middleware, this.route);
  }

  /**
   * Get request input value from query string, params or body
   */
  public input(key: string, defaultValue: any = null) {
    return get(this.payload.all, key, defaultValue);
  }

  /**
   * Get request body
   */
  public get body() {
    return this.payload.body;
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
    return this.payload.params;
  }

  /**
   * Get request query
   */
  public get query() {
    return this.payload.query;
  }

  /**
   * Get all inputs
   */
  public all() {
    return this.payload.all;
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
