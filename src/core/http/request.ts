import config from "@mongez/config";
import { only } from "@mongez/reinforcements";
import { Validator } from "core/validator";
import { FastifyRequest } from "fastify";
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
   * Route handler
   */
  private handler: any;

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
   * Set route handler
   */
  public setHandler(handler: any) {
    this.handler = handler;

    return this;
  }

  /**
   * Execute the request
   */
  public async execute() {
    if (this.handler.validation) {
      const validator = new Validator(this, this.handler.validation.rules);

      await validator.scan(); // start scanning the rules

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

    return await this.handler(this, this.response);
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
