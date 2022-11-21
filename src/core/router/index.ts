import request from "core/http/request";
import { Route, RouteOptions } from "./types";

export class Router {
  /**
   * Routes list
   */
  private routes: Route[] = [];

  /**
   * Router Instance
   */
  private static instance: Router;

  /**
   * Get router instance
   */
  public static getInstance() {
    if (!Router.instance) {
      Router.instance = new Router();
    }

    return Router.instance;
  }

  private constructor() {
    //
  }

  /**
   * Add get request method
   */
  public get(path: string, handler: any, options: RouteOptions = {}) {
    this.routes.push({
      method: "GET",
      path,
      handler,
      ...options,
    });

    return this;
  }

  /**
   * Add post request method
   */
  public post(path: string, handler: any, options: RouteOptions = {}) {
    this.routes.push({
      method: "POST",
      path,
      handler,
      ...options,
    });

    return this;
  }

  /**
   * Add put request method
   */
  public put(path: string, handler: any, options: RouteOptions = {}) {
    this.routes.push({
      method: "PUT",
      path,
      handler,
      ...options,
    });

    return this;
  }

  /**
   * Add delete request method
   */
  public delete(path: string, handler: any, options: RouteOptions = {}) {
    this.routes.push({
      method: "DELETE",
      path,
      handler,
      ...options,
    });

    return this;
  }

  /**
   * Add patch request method
   */
  public patch(path: string, handler: any, options: RouteOptions = {}) {
    this.routes.push({
      method: "PATCH",
      path,
      handler,
      ...options,
    });

    return this;
  }

  /**
   * Get all routes list
   */
  public list() {
    return this.routes;
  }

  /**
   * Register routes to the server
   */
  public scan(server: any) {
    this.routes.forEach(route => {
      const requestMethod = route.method.toLowerCase();
      const requestMethodFunction = server[requestMethod].bind(server);

      requestMethodFunction(route.path, this.handleRoute(route));
    });
  }

  /**
   * Handle the given route
   */
  private handleRoute(route: Route) {
    return async (fastifyRequest: any, fastifyResponse: any) => {
      request
        .setRequest(fastifyRequest)
        .setResponse(fastifyResponse)
        .setRoute(route);

      return await request.execute();
    };
  }
}

const router = Router.getInstance();

export default router;
