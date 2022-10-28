import { Route } from "./types";

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
   *
   * // Method chaining
   */
  public get(path: string, handler: any) {
    this.routes.push({
      method: "GET",
      path,
      handler,
    });

    return this;
  }

  /**
   * Register routes to the server
   */
  public scan(server: any) {
    this.routes.forEach(route => {
      const requestMethod = route.method.toLowerCase();
      const requestMethodFunction = server[requestMethod].bind(server);

      requestMethodFunction(route.path, route.handler);
    });
  }
}

const router = Router.getInstance();

export default router;
