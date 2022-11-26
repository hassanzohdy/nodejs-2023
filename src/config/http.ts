// import { authMiddleware } from "core/auth/auth-middleware";

const httpConfigurations = {
  middleware: {
    // apply the middleware to all routes
    all: [],
    // apply the middleware to specific routes
    only: {
      routes: [],
      namedRoutes: ["users.list"],
      // middleware: [authMiddleware("guest")],
    },
    // exclude the middleware from specific routes
    except: {
      routes: [],
      namedRoutes: [],
      middleware: [],
    },
  },
};

export default httpConfigurations;
