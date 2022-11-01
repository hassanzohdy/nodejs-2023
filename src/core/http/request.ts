import { FastifyRequest } from "fastify";

export class Request {
  /**
   * Fastify Request object
   */
  public request!: FastifyRequest;

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
    return await this.handler(this, this.response);
  }
}

const request = new Request();

export default request;
