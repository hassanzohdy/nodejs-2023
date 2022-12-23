import concatRoute from "@mongez/concat-route";
import { ltrim, merge, toCamelCase } from "@mongez/reinforcements";
import Is from "@mongez/supportive-is";
import { Request, request, Response } from "core/http";
import {
  GroupedRoutesOptions,
  Route,
  RouteHandler,
  RouteHandlerValidation,
  RouteOptions,
  RouteResource,
} from "./types";

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
  public get(path: string, handler: RouteHandler, options: RouteOptions = {}) {
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
  public post(path: string, handler: RouteHandler, options: RouteOptions = {}) {
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
  public put(path: string, handler: RouteHandler, options: RouteOptions = {}) {
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
  public delete(
    path: string,
    handler: RouteHandler,
    options: RouteOptions = {},
  ) {
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
  public patch(
    path: string,
    handler: RouteHandler,
    options: RouteOptions = {},
  ) {
    this.routes.push({
      method: "PATCH",
      path,
      handler,
      ...options,
    });

    return this;
  }

  /**
   * Add full restful resource routes
   * This method will generate the following routes:
   * 1. GET /path: list all resources
   * 2. GET /path/:id: get a single resource
   * 3. POST /path: create a new resource
   * 4. PUT /path/:id: update a resource
   * 5. DELETE /path/:id: delete a resource
   * 6. PATCH /path/:id: update a resource partially
   */
  public restfulResource(
    path: string,
    resource: RouteResource,
    options: RouteOptions = {},
  ) {
    // get base resource name
    const baseResourceName = options.name || toCamelCase(ltrim(path, "/"));

    if (resource.list) {
      const resourceName = baseResourceName + ".list";
      this.get(path, resource.list.bind(resource), {
        ...options,
        name: resourceName,
      });
    }

    if (resource.get) {
      const resourceName = baseResourceName + ".get";

      this.get(path + "/:id", resource.get.bind(resource), {
        ...options,
        name: resourceName,
      });
    }

    if (resource.create) {
      const resourceName = baseResourceName + ".create";

      this.manageValidation(resource, "create");

      this.post(path, resource.create.bind(resource), {
        ...options,
        name: resourceName,
      });
    }

    if (resource.update) {
      const resourceName = baseResourceName + ".update";

      this.manageValidation(resource, "update");

      this.put(path + "/:id", resource.update.bind(resource), {
        ...options,
        name: resourceName,
      });
    }

    if (resource.patch) {
      const resourceName = baseResourceName + ".patch";

      this.manageValidation(resource, "patch");

      this.patch(path + "/:id", resource.patch.bind(resource), {
        ...options,
        name: resourceName,
      });
    }

    if (resource.delete) {
      const resourceName = baseResourceName + ".delete";

      this.delete(path + "/:id", resource.delete.bind(resource), {
        ...options,
        name: resourceName,
      });
    }

    return this;
  }

  /**
   * Group routes with options
   */
  public group(options: GroupedRoutesOptions, callback?: () => void) {
    const { prefix, name, method, middleware, routes } = options;

    const applyGroupOptionsOnRoutes = (
      // type is routes of grouped routes options but it has to be changed to be strict
      routes: Route[],
    ) => {
      routes.forEach(route => {
        if (prefix) {
          route.path = concatRoute(prefix, route.path);
        }

        if (name) {
          route.name =
            name + "." + (route.name || toCamelCase(ltrim(route.path, "/")));
        }

        if (method) {
          route.method = method;
        }

        if (!route.method) {
          route.method = "GET";
        }

        if (middleware) {
          route.middleware = route.middleware
            ? [...route.middleware, ...middleware]
            : middleware;
        }

        this.routes.push(route);
      });
    };

    if (routes) {
      applyGroupOptionsOnRoutes(routes as Route[]);
    }

    if (callback) {
      const currentRoutes = [...this.routes];
      callback();
      // get new routes
      const newRoutes = this.routes.filter(
        route => !currentRoutes.includes(route),
      );

      this.routes = [...currentRoutes];

      applyGroupOptionsOnRoutes(newRoutes);
    }

    return this;
  }

  /**
   * Manage validation system for the given resource
   */
  private manageValidation(
    resource: RouteResource,
    method: "create" | "update" | "patch",
  ) {
    const handler = resource[method]?.bind(resource);

    if (!handler) return;

    const methodValidation = resource?.validation?.[method];

    if (!resource.validation || !methodValidation) return;

    if (resource.validation.all) {
      const validationMethods = {
        all: resource?.validation?.all?.validate,
        [method]: methodValidation.validate,
      };

      const validation: RouteHandlerValidation = {};

      if (resource.validation.all.rules || methodValidation.rules) {
        validation.rules = merge(
          resource.validation.all.rules,
          methodValidation.rules,
        );
      }

      if (validationMethods.all || validationMethods[method]) {
        validation.validate = async (request: Request, response: Response) => {
          if (validationMethods.all) {
            const output = await validationMethods.all(request, response);

            if (output) return output;
          }

          if (validationMethods[method]) {
            return await validationMethods[method]?.(request, response);
          }

          return undefined;
        };
      }

      if (!Is.empty(validation)) {
        handler.validation = validation;
      }
    } else {
      handler.validation = resource.validation[method];
    }

    if (handler.validation?.validate) {
      handler.validation.validate = handler.validation.validate.bind(resource);
    }

    resource[method] = handler;
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
